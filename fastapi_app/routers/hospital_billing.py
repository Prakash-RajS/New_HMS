# # fastapi_app/routers/hospital_billing.py
# from fastapi import APIRouter, HTTPException, BackgroundTasks
# from pydantic import BaseModel
# from HMS_backend.models import HospitalInvoiceHistory, Patient
# from datetime import date
# from typing import List
# import csv
# import io
# import openpyxl
# import os
# import tempfile
# from zipfile import ZipFile
# from fastapi.responses import StreamingResponse, FileResponse
# import time

# router = APIRouter(prefix="/hospital-billing", tags=["Hospital Billing Management"])

# # -------------------------------
# # Pydantic Schema
# # -------------------------------
# class InvoiceSchema(BaseModel):
#     invoice_id: str
#     date: str
#     patient_name: str
#     patient_id: str
#     department: str
#     amount: float
#     payment_method: str
#     status: str

# class InvoiceIds(BaseModel):
#     ids: List[str]

# # -------------------------------
# # Helper: Delayed file removal (fixes Windows file lock)
# # -------------------------------
# def delayed_remove(file_path: str, delay: int = 3):
#     time.sleep(delay)
#     try:
#         if os.path.exists(file_path):
#             os.remove(file_path)
#     except Exception as e:
#         print(f"Failed to delete temp file {file_path}: {e}")

# # -------------------------------
# # Helper to get invoice data
# # -------------------------------
# def get_invoice_data(invoice):
#     dept = invoice.department or "Unknown"
#     try:
#         patient = Patient.objects.get(patient_unique_id=invoice.patient_id)
#         if patient.department:
#             dept = patient.department.name
#     except Patient.DoesNotExist:
#         pass
#     except Exception as e:
#         print(f"Error getting patient for {invoice.patient_id}: {e}")

#     try:
#         date_str = invoice.date.isoformat()
#     except:
#         date_str = str(invoice.date)

#     return {
#         "invoice_id": invoice.invoice_id,
#         "date": date_str,
#         "patient_name": invoice.patient_name,
#         "patient_id": invoice.patient_id,
#         "department": dept,
#         "amount": float(invoice.amount),
#         "payment_method": invoice.payment_method or "-",
#         "status": invoice.status,
#     }

# # -------------------------------
# # CRUD Endpoints
# # -------------------------------
# @router.get("/", response_model=List[InvoiceSchema])
# def list_invoices():
#     try:
#         invoices = HospitalInvoiceHistory.objects.all()
#         data = [get_invoice_data(inv) for inv in invoices]
#         return data
#     except Exception as e:
#         print(f"Error in list_hospital_invoices: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to fetch hospital invoices: {str(e)}")

# @router.get("/{invoice_id}", response_model=InvoiceSchema)
# def get_invoice(invoice_id: str):
#     try:
#         invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
#         return get_invoice_data(invoice)
#     except HospitalInvoiceHistory.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Invoice not found")
#     except Exception as e:
#         print(f"Error getting hospital invoice {invoice_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to get invoice: {str(e)}")

# @router.delete("/{invoice_id}")
# def delete_invoice(invoice_id: str):
#     try:
#         invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
#         invoice.delete()
#         return {"detail": f"Hospital Invoice {invoice_id} deleted successfully"}
#     except HospitalInvoiceHistory.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Invoice not found")
#     except Exception as e:
#         print(f"Error deleting hospital invoice {invoice_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to delete invoice: {str(e)}")

# # -------------------------------
# # PDF Endpoints
# # -------------------------------
# @router.get("/pdf/{invoice_id}")
# def get_pdf(invoice_id: str):
#     try:
#         invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)

#         # Option 1: Use pdf_file (FileField) if available
#         if invoice.pdf_file and os.path.exists(invoice.pdf_file.path):
#             pdf_path = invoice.pdf_file.path
#         else:
#             # Option 2: Fallback to manual path in invoices_generator directory
#             BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#             INVOICE_DIR = os.path.join(BASE_DIR, "fastapi_app", "invoices_generator")
#             pdf_path = os.path.join(INVOICE_DIR, f"{invoice_id}.pdf")

#         if not os.path.exists(pdf_path):
#             raise HTTPException(status_code=404, detail="PDF not found")

#         # Inline for view/print in browser + CORS headers
#         headers = {
#             "Content-Disposition": "inline; filename=invoice.pdf",
#             "Access-Control-Allow-Origin": "http://localhost:5173",
#             "Access-Control-Expose-Headers": "*",
#         }
#         return FileResponse(pdf_path, media_type="application/pdf", headers=headers)

#     except HospitalInvoiceHistory.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Invoice not found")
#     except Exception as e:
#         print(f"Error serving hospital PDF {invoice_id}: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to get PDF: {str(e)}")

# @router.post("/download-selected")
# def download_selected(invoice_ids: InvoiceIds, background_tasks: BackgroundTasks):
#     try:
#         BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
#         INVOICE_DIR = os.path.join(BASE_DIR, "fastapi_app", "invoices_generator")

#         with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp_file:
#             zip_path = tmp_file.name

#         with ZipFile(zip_path, "w") as zipf:
#             added = False
#             for invoice_id in invoice_ids.ids:
#                 try:
#                     invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
#                     pdf_path = None

#                     if invoice.pdf_file and os.path.exists(invoice.pdf_file.path):
#                         pdf_path = invoice.pdf_file.path
#                     else:
#                         fallback_path = os.path.join(INVOICE_DIR, f"{invoice_id}.pdf")
#                         if os.path.exists(fallback_path):
#                             pdf_path = fallback_path

#                     if pdf_path and os.path.exists(pdf_path):
#                         zipf.write(pdf_path, f"{invoice_id}.pdf")
#                         added = True
#                     else:
#                         print(f"PDF not found for hospital invoice {invoice_id}")
#                 except HospitalInvoiceHistory.DoesNotExist:
#                     print(f"Invoice {invoice_id} not found in DB")
#                     continue

#             if not added:
#                 os.remove(zip_path)
#                 raise HTTPException(status_code=404, detail="No PDFs found for selected invoices")

#         # Delayed cleanup to avoid Windows file lock
#         background_tasks.add_task(delayed_remove, zip_path)

#         return FileResponse(
#             zip_path,
#             media_type="application/zip",
#             filename="selected_hospital_invoices.zip",
#             headers={"Access-Control-Expose-Headers": "Content-Disposition"}
#         )

#     except Exception as e:
#         if 'zip_path' in locals() and os.path.exists(zip_path):
#             try:
#                 os.remove(zip_path)
#             except:
#                 pass
#         print(f"Error downloading selected hospital PDFs: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to download PDFs: {str(e)}")

# # -------------------------------
# # Export Endpoints (CSV/Excel)
# # -------------------------------
# @router.get("/export/csv")
# def export_invoices_csv():
#     try:
#         invoices = HospitalInvoiceHistory.objects.all()
#         invoice_list = [get_invoice_data(inv) for inv in invoices]
#         if not invoice_list:
#             raise HTTPException(status_code=404, detail="No hospital invoices found")

#         output = io.StringIO()
#         fieldnames = list(invoice_list[0].keys())
#         writer = csv.DictWriter(output, fieldnames=fieldnames)
#         writer.writeheader()
#         writer.writerows(invoice_list)
#         output.seek(0)

#         return StreamingResponse(
#             iter([output.getvalue()]),
#             media_type="text/csv",
#             headers={"Content-Disposition": "attachment; filename=hospital_invoices.csv"}
#         )
#     except Exception as e:
#         print(f"Error exporting hospital CSV: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to export CSV: {str(e)}")

# @router.get("/export/excel")
# def export_invoices_excel():
#     try:
#         invoices = HospitalInvoiceHistory.objects.all()
#         invoice_list = [get_invoice_data(inv) for inv in invoices]
#         if not invoice_list:
#             raise HTTPException(status_code=404, detail="No hospital invoices found")

#         wb = openpyxl.Workbook()
#         ws = wb.active
#         ws.title = "Hospital Invoices"
#         fieldnames = list(invoice_list[0].keys())
#         ws.append(fieldnames)
#         for row in invoice_list:
#             ws.append(list(row.values()))

#         output = io.BytesIO()
#         wb.save(output)
#         output.seek(0)

#         return StreamingResponse(
#             output,
#             media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#             headers={"Content-Disposition": "attachment; filename=hospital_invoices.xlsx"}
#         )
#     except Exception as e:
#         print(f"Error exporting hospital Excel: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to export Excel: {str(e)}")

# fastapi_app/routers/hospital_billing.py

# fastapi_app/routers/hospital_billing.py

# fastapi_app/routers/hospital_billing.py

from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from pydantic import BaseModel
from HMS_backend.models import HospitalInvoiceHistory, HospitalInvoiceItem, Patient
from datetime import date
from typing import List, Optional
from decimal import Decimal
import csv
import io
import openpyxl
import os
import tempfile
from zipfile import ZipFile
from fastapi.responses import StreamingResponse, FileResponse
import time
from asgiref.sync import sync_to_async
from fastapi_app.routers.notifications import NotificationService

router = APIRouter(prefix="/hospital-billing", tags=["Hospital Billing Management"])


# -------------------------------
# Pydantic Schemas
# -------------------------------
class InvoiceItemSchema(BaseModel):
    s_no: int
    description: str
    quantity: int
    unit_price: float
    amount: float

    class Config:
        from_attributes = True


class InvoiceDetailSchema(BaseModel):
    invoice_id: str
    date: str
    patient_name: str
    patient_id: str
    department: str
    amount: float
    payment_method: str
    status: str
    admission_date: Optional[str] = None
    discharge_date: Optional[str] = None
    doctor: str
    phone: str
    email: str
    address: str
    tax_percent: float
    subtotal: float
    tax_amount: float
    grand_total: float
    items: List[InvoiceItemSchema] = []

    class Config:
        from_attributes = True


class InvoiceListSchema(BaseModel):
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
# Helper Functions
# -------------------------------
def delayed_remove(file_path: str, delay: int = 5):
    time.sleep(delay)
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Failed to delete temp file {file_path}: {e}")


async def get_department_name(patient_id: str) -> str:

    @sync_to_async
    def fetch_dept():
        try:
            patient = Patient.objects.select_related("department").get(
                patient_unique_id=patient_id
            )
            return patient.department.name if patient.department else "General"
        except:
            return "Unknown"

    return await fetch_dept()


def format_date(date_obj) -> str:
    if not date_obj:
        return "-"
    try:
        return date_obj.isoformat() if hasattr(date_obj, "isoformat") else str(date_obj)
    except:
        return str(date_obj)


# -------------------------------
# CRUD Endpoints
# -------------------------------
@router.get("/", response_model=List[InvoiceListSchema])
async def list_invoices():
    try:
        invoices = await sync_to_async(list)(
            HospitalInvoiceHistory.objects.select_related().all().order_by("-date", "-created_at")
        )
        result = []
        for inv in invoices:
            dept = await get_department_name(inv.patient_id)
            result.append({
                "invoice_id": inv.invoice_id,
                "date": format_date(inv.date),
                "patient_name": inv.patient_name,
                "patient_id": inv.patient_id,
                "department": dept,
                "amount": float(inv.amount),
                "payment_method": inv.payment_method or "-",
                "status": inv.status,
            })
        return result
    except Exception as e:
        await NotificationService.send_billing_error(str(e), bill_type="Hospital Invoice List")
        raise HTTPException(status_code=500, detail="Failed to fetch invoices")


@router.get("/{invoice_id}", response_model=InvoiceDetailSchema)
async def get_invoice_detail(invoice_id: str):
    try:
        invoice = await sync_to_async(HospitalInvoiceHistory.objects.prefetch_related("items").get)(
            invoice_id=invoice_id
        )

        # Fetch items
        items_qs = invoice.items.all()
        items = await sync_to_async(list)(items_qs)
        item_list = [
            InvoiceItemSchema(
                s_no=item.s_no,
                description=item.description,
                quantity=item.quantity,
                unit_price=float(item.unit_price),
                amount=float(item.amount),
            )
            for item in items
        ]

        subtotal = sum(item.amount for item in items)
        tax_amount = subtotal * (invoice.tax_percent / 100)
        grand_total = subtotal + tax_amount

        dept = await get_department_name(invoice.patient_id)

        data = InvoiceDetailSchema(
            invoice_id=invoice.invoice_id,
            date=format_date(invoice.date),
            patient_name=invoice.patient_name,
            patient_id=invoice.patient_id,
            department=dept,
            amount=float(invoice.amount),
            payment_method=invoice.payment_method or "Cash",
            status=invoice.status,
            admission_date=format_date(invoice.admission_date),
            discharge_date=format_date(invoice.discharge_date),
            doctor=invoice.doctor,
            phone=invoice.phone,
            email=invoice.email,
            address=invoice.address or "N/A",
            tax_percent=float(invoice.tax_percent),
            subtotal=round(subtotal, 2),
            tax_amount=round(tax_amount, 2),
            grand_total=round(grand_total, 2),
            items=item_list,
        )

        # Send notification when invoice is viewed
        await NotificationService.send_hospital_bill_generated({
            "invoice_id": invoice.invoice_id,
            "patient_name": invoice.patient_name,
            "amount": float(invoice.amount),
        })

        return data

    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        await NotificationService.send_billing_error(str(e), bill_type="Invoice Detail", reference_id=invoice_id)
        raise HTTPException(status_code=500, detail="Failed to fetch invoice details")


@router.delete("/{invoice_id}")
async def delete_invoice(invoice_id: str):
    try:
        invoice = await sync_to_async(HospitalInvoiceHistory.objects.get)(invoice_id=invoice_id)
        await sync_to_async(invoice.delete)()
        await NotificationService.send_billing_error(
            f"Hospital invoice {invoice_id} deleted by user",
            bill_type="Invoice Deleted"
        )
        return {"detail": f"Invoice {invoice_id} deleted successfully"}
    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        await NotificationService.send_billing_error(str(e), bill_type="Invoice Delete")
        raise HTTPException(status_code=500, detail="Delete failed")


# -------------------------------
# PDF Download Endpoints
# -------------------------------
@router.get("/pdf/{invoice_id}")
async def download_pdf(invoice_id: str):
    try:
        invoice = await sync_to_async(HospitalInvoiceHistory.objects.get)(invoice_id=invoice_id)

        # Try DB-stored PDF first
        if invoice.pdf_file and invoice.pdf_file.name and os.path.exists(invoice.pdf_file.path):
            pdf_path = invoice.pdf_file.path
        else:
            # Fallback to file system
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            fallback_path = os.path.join(BASE_DIR, "fastapi_app", "invoices_generator", f"{invoice_id}.pdf")
            if os.path.exists(fallback_path):
                pdf_path = fallback_path
            else:
                raise HTTPException(status_code=404, detail="PDF file not found on server")

        await NotificationService.send_hospital_bill_generated(get_invoice_data(invoice))

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{invoice_id}.pdf",
            headers={"Content-Disposition": f"inline; filename={invoice_id}.pdf"}
        )
    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        await NotificationService.send_billing_error(str(e), bill_type="PDF Download")
        raise HTTPException(status_code=500, detail="PDF not available")


@router.post("/download-selected")
async def download_selected_pdfs(invoice_ids: InvoiceIds, background_tasks: BackgroundTasks):
    if not invoice_ids.ids:
        raise HTTPException(status_code=400, detail="No invoice IDs provided")

    with tempfile.NamedTemporaryFile(suffix=".zip", delete=False) as tmp:
        zip_path = tmp.name

    try:
        with ZipFile(zip_path, "w") as zipf:
            found = 0
            for inv_id in invoice_ids.ids:
                try:
                    invoice = await sync_to_async(HospitalInvoiceHistory.objects.get)(invoice_id=inv_id)
                    pdf_path = None

                    if invoice.pdf_file and os.path.exists(invoice.pdf_file.path):
                        pdf_path = invoice.pdf_file.path
                    else:
                        fallback = os.path.join("fastapi_app", "invoices_generator", f"{inv_id}.pdf")
                        if os.path.exists(fallback):
                            pdf_path = fallback

                    if pdf_path:
                        zipf.write(pdf_path, arcname=f"{inv_id}.pdf")
                        found += 1
                except HospitalInvoiceHistory.DoesNotExist:
                    continue

            if found == 0:
                os.remove(zip_path)
                raise HTTPException(status_code=404, detail="No PDFs found for selected invoices")

        background_tasks.add_task(delayed_remove, zip_path, delay=10)

        await NotificationService.send_hospital_bill_generated({
            "message": f"{found} hospital invoice(s) downloaded as ZIP",
            "count": found
        })

        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename="hospital_invoices_selected.zip"
        )

    except Exception as e:
        if os.path.exists(zip_path):
            os.remove(zip_path)
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------
# Export: CSV & Excel (Now with Line Items!)
# -------------------------------
@router.get("/export/csv")
async def export_csv(include_items: bool = False):
    invoices = await sync_to_async(list)(HospitalInvoiceHistory.objects.prefetch_related("items").all())

    output = io.StringIO()
    writer = csv.writer(output)

    if include_items:
        # Flat format with repeated per item
        writer.writerow([
            "Invoice ID", "Date", "Patient Name", "Patient ID", "Department",
            "S.No", "Description", "Qty", "Unit Price", "Amount",
            "Subtotal", "Tax", "Grand Total", "Status"
        ])
        for inv in invoices:
            items = inv.items.all()
            subtotal = sum(item.amount for item in items) if items else 0
            tax = subtotal * (inv.tax_percent / 100)
            first = True
            for item in items:
                writer.writerow([
                    inv.invoice_id,
                    inv.date,
                    inv.patient_name,
                    inv.patient_id,
                    await get_department_name(inv.patient_id),
                    item.s_no,
                    item.description,
                    item.quantity,
                    item.unit_price,
                    item.amount,
                    subtotal if first else "",
                    tax if first else "",
                    subtotal + tax if first else "",
                    inv.status,
                ])
                first = False
            if not items:
                writer.writerow([inv.invoice_id, inv.date, inv.patient_name, inv.patient_id, "...", "", "No items", "", "", "", "", "", "", inv.status])
    else:
        # Summary only
        writer.writerow(["Invoice ID", "Date", "Patient Name", "Patient ID", "Department", "Amount", "Status", "Payment Method"])
        for inv in invoices:
            writer.writerow([
                inv.invoice_id,
                inv.date,
                inv.patient_name,
                inv.patient_id,
                await get_department_name(inv.patient_id),
                inv.amount,
                inv.status,
                inv.payment_method or "Cash"
            ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=hospital_invoices.csv"}
    )


@router.get("/export/excel")
async def export_excel():
    from decimal import Decimal

    invoices = await sync_to_async(list)(
        HospitalInvoiceHistory.objects.prefetch_related("items").all()
    )

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Hospital Invoices"

    # Header
    header = [
        "Invoice ID", "Date", "Patient", "ID", "Dept",
        "Item", "Desc", "Qty", "Price", "Amount",
        "Subtotal", "Tax", "Total", "Status"
    ]
    ws.append(header)

    for inv in invoices:
        items = list(inv.items.all())

        # ---- Decimal Safe ----
        subtotal = sum(Decimal(str(i.amount)) for i in items) if items else Decimal("0")
        tax_percent = Decimal(str(inv.tax_percent))
        tax = subtotal * (tax_percent / Decimal("100"))
        total = subtotal + tax

        dept = await get_department_name(inv.patient_id)

        if items:
            for row_index, item in enumerate(items, 1):
                ws.append([
                    inv.invoice_id if row_index == 1 else "",
                    inv.date if row_index == 1 else "",
                    inv.patient_name if row_index == 1 else "",
                    inv.patient_id if row_index == 1 else "",
                    dept if row_index == 1 else "",
                    item.s_no,
                    item.description,
                    item.quantity,
                    float(item.unit_price),
                    float(item.amount),
                    float(subtotal) if row_index == 1 else "",
                    float(tax) if row_index == 1 else "",
                    float(total) if row_index == 1 else "",
                    inv.status if row_index == 1 else "",
                
                ])
        else:
            ws.append([
                inv.invoice_id, inv.date, inv.patient_name, inv.patient_id, dept,
                "", "No items", "", "", "",
                float(subtotal), float(tax), float(total),
                inv.status
            ])

    # ---- Create Excel file ----
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=hospital_invoices.xlsx"}
    )
