# fastapi_app/routers/hospital_billing.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from HMS_backend.models import HospitalInvoiceHistory, Patient
from datetime import date
from typing import List
import csv
import io
import openpyxl
import os
import tempfile
from zipfile import ZipFile
from fastapi.responses import StreamingResponse, FileResponse
import time

router = APIRouter(prefix="/hospital-billing", tags=["Hospital Billing Management"])

# -------------------------------
# Pydantic Schema
# -------------------------------
class InvoiceSchema(BaseModel):
    invoice_id: str
    date: str
    patient_name: str
    patient_id: str
    department: str
    amount: float
    payment_method: str
    status: str

class InvoiceIds(BaseModel):
    ids: List[str]

# -------------------------------
# Helper: Delayed file removal (fixes Windows file lock)
# -------------------------------
def delayed_remove(file_path: str, delay: int = 3):
    time.sleep(delay)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Failed to delete temp file {file_path}: {e}")

# -------------------------------
# Helper to get invoice data
# -------------------------------
def get_invoice_data(invoice):
    dept = invoice.department or "Unknown"
    try:
        patient = Patient.objects.get(patient_unique_id=invoice.patient_id)
        if patient.department:
            dept = patient.department.name
    except Patient.DoesNotExist:
        pass
    except Exception as e:
        print(f"Error getting patient for {invoice.patient_id}: {e}")

    try:
        date_str = invoice.date.isoformat()
    except:
        date_str = str(invoice.date)

    return {
        "invoice_id": invoice.invoice_id,
        "date": date_str,
        "patient_name": invoice.patient_name,
        "patient_id": invoice.patient_id,
        "department": dept,
        "amount": float(invoice.amount),
        "payment_method": invoice.payment_method or "-",
        "status": invoice.status,
    }

# -------------------------------
# CRUD Endpoints
# -------------------------------
@router.get("/", response_model=List[InvoiceSchema])
def list_invoices():
    try:
        invoices = HospitalInvoiceHistory.objects.all()
        data = [get_invoice_data(inv) for inv in invoices]
        return data
    except Exception as e:
        print(f"Error in list_hospital_invoices: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch hospital invoices: {str(e)}")

@router.get("/{invoice_id}", response_model=InvoiceSchema)
def get_invoice(invoice_id: str):
    try:
        invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
        return get_invoice_data(invoice)
    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        print(f"Error getting hospital invoice {invoice_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get invoice: {str(e)}")

@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: str):
    try:
        invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
        invoice.delete()
        return {"detail": f"Hospital Invoice {invoice_id} deleted successfully"}
    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        print(f"Error deleting hospital invoice {invoice_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete invoice: {str(e)}")

# -------------------------------
# PDF Endpoints
# -------------------------------
@router.get("/pdf/{invoice_id}")
def get_pdf(invoice_id: str):
    try:
        invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)

        # Option 1: Use pdf_file (FileField) if available
        if invoice.pdf_file and os.path.exists(invoice.pdf_file.path):
            pdf_path = invoice.pdf_file.path
        else:
            # Option 2: Fallback to manual path in invoices_generator directory
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            INVOICE_DIR = os.path.join(BASE_DIR, "fastapi_app", "invoices_generator")
            pdf_path = os.path.join(INVOICE_DIR, f"{invoice_id}.pdf")

        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="PDF not found")

        # Inline for view/print in browser + CORS headers
        headers = {
            "Content-Disposition": "inline; filename=invoice.pdf",
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Expose-Headers": "*",
        }
        return FileResponse(pdf_path, media_type="application/pdf", headers=headers)

    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        print(f"Error serving hospital PDF {invoice_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get PDF: {str(e)}")

@router.post("/download-selected")
def download_selected(invoice_ids: InvoiceIds, background_tasks: BackgroundTasks):
    try:
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        INVOICE_DIR = os.path.join(BASE_DIR, "fastapi_app", "invoices_generator")

        with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp_file:
            zip_path = tmp_file.name

        with ZipFile(zip_path, "w") as zipf:
            added = False
            for invoice_id in invoice_ids.ids:
                try:
                    invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
                    pdf_path = None

                    if invoice.pdf_file and os.path.exists(invoice.pdf_file.path):
                        pdf_path = invoice.pdf_file.path
                    else:
                        fallback_path = os.path.join(INVOICE_DIR, f"{invoice_id}.pdf")
                        if os.path.exists(fallback_path):
                            pdf_path = fallback_path

                    if pdf_path and os.path.exists(pdf_path):
                        zipf.write(pdf_path, f"{invoice_id}.pdf")
                        added = True
                    else:
                        print(f"PDF not found for hospital invoice {invoice_id}")
                except HospitalInvoiceHistory.DoesNotExist:
                    print(f"Invoice {invoice_id} not found in DB")
                    continue

            if not added:
                os.remove(zip_path)
                raise HTTPException(status_code=404, detail="No PDFs found for selected invoices")

        # Delayed cleanup to avoid Windows file lock
        background_tasks.add_task(delayed_remove, zip_path)

        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="selected_hospital_invoices.zip",
            headers={"Access-Control-Expose-Headers": "Content-Disposition"}
        )

    except Exception as e:
        if 'zip_path' in locals() and os.path.exists(zip_path):
            try:
                os.remove(zip_path)
            except:
                pass
        print(f"Error downloading selected hospital PDFs: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to download PDFs: {str(e)}")

# -------------------------------
# Export Endpoints (CSV/Excel)
# -------------------------------
@router.get("/export/csv")
def export_invoices_csv():
    try:
        invoices = HospitalInvoiceHistory.objects.all()
        invoice_list = [get_invoice_data(inv) for inv in invoices]
        if not invoice_list:
            raise HTTPException(status_code=404, detail="No hospital invoices found")

        output = io.StringIO()
        fieldnames = list(invoice_list[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(invoice_list)
        output.seek(0)

        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=hospital_invoices.csv"}
        )
    except Exception as e:
        print(f"Error exporting hospital CSV: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to export CSV: {str(e)}")

@router.get("/export/excel")
def export_invoices_excel():
    try:
        invoices = HospitalInvoiceHistory.objects.all()
        invoice_list = [get_invoice_data(inv) for inv in invoices]
        if not invoice_list:
            raise HTTPException(status_code=404, detail="No hospital invoices found")

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Hospital Invoices"
        fieldnames = list(invoice_list[0].keys())
        ws.append(fieldnames)
        for row in invoice_list:
            ws.append(list(row.values()))

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=hospital_invoices.xlsx"}
        )
    except Exception as e:
        print(f"Error exporting hospital Excel: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to export Excel: {str(e)}")