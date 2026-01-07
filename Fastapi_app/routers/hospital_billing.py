# fastapi_app/routers/hospital_billing.py
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel, EmailStr
from HMS_backend.models import (
    HospitalInvoiceHistory, 
    HospitalInvoiceItem, 
    Patient,
    TreatmentCharge
)
from datetime import date, datetime
from typing import List, Optional, Dict, Any
from decimal import Decimal
import csv
import io
import openpyxl
import os
import tempfile
from zipfile import ZipFile
import time
from asgiref.sync import sync_to_async
from django.db import transaction
from django.utils import timezone

# Import NotificationService
from Fastapi_app.routers.notifications import NotificationService

# Jinja2 + WeasyPrint for PDF generation
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

# Paths for PDF generation
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP_DIR = os.path.join(BASE_DIR, "Fastapi_app")
TEMPLATE_DIR = os.path.join(APP_DIR, "frontend")
PDF_OUTPUT_DIR = os.path.join(APP_DIR, "invoices_generator")
os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)

# Jinja2 environment
env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=select_autoescape(["html", "xml"])
)

try:
    from num2words import num2words
except ImportError:
    num2words = None

router = APIRouter(prefix="/hospital-billing", tags=["Hospital Billing Management"])


# -------------------------------
# Pydantic Schemas
# -------------------------------
class InvoiceItemIn(BaseModel):
    description: str
    quantity: int
    unit_price: Decimal


class InvoiceCreateIn(BaseModel):
    date: date
    patient_name: str
    patient_id: str
    department: str
    payment_method: str = "Cash"
    status: str = "Paid"

    admission_date: date
    discharge_date: Optional[date] = None
    doctor: str = "N/A"
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

    invoice_items: List[InvoiceItemIn]
    tax_percent: Decimal = Decimal("18.0")
    transaction_id: Optional[str] = None
    payment_date: Optional[date] = None
    treatment_charge_ids: Optional[List[int]] = None


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


class TreatmentChargeSchema(BaseModel):
    id: Optional[int] = None
    description: str
    quantity: int
    unit_price: float
    amount: float
    status: str
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True


class PatientTreatmentChargesResponse(BaseModel):
    patient_id: str
    patient_name: str
    charges: List[TreatmentChargeSchema]
    total_pending: float
    total_billed: float


class StatusUpdate(BaseModel):
    status: str


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


def amount_to_words(amount: Decimal) -> str:
    if num2words:
        try:
            return f"{num2words(float(amount), lang='en_IN').title()} Rupees Only"
        except:
            pass
    return f"{amount:.2f} Rupees Only"


# -------------------------------
# MAIN INVOICE GENERATION ENDPOINT
# -------------------------------
@router.post("/generate-invoice", response_class=FileResponse)
async def generate_invoice_pdf(payload: InvoiceCreateIn):
    """
    Generate a new hospital invoice with PDF and update treatment charges
    """
    if not payload.invoice_items:
        raise HTTPException(status_code=400, detail="At least one invoice item is required.")

    try:
        @sync_to_async
        def create_invoice_with_pdf():
            # 1. Validate patient
            try:
                patient = Patient.objects.get(patient_unique_id=payload.patient_id)
            except Patient.DoesNotExist:
                raise HTTPException(status_code=404, detail="Patient not found")

            # 2. Generate invoice ID
            last = HospitalInvoiceHistory.objects.order_by('-id').first()
            num = 1
            if last and last.invoice_id.startswith("HS_INV_"):
                try:
                    num = int(last.invoice_id.split("_")[-1]) + 1
                except:
                    num = 1
            invoice_id = f"HS_INV_{num:04d}"

            with transaction.atomic():
                # 3. Create main invoice
                invoice = HospitalInvoiceHistory.objects.create(
                    invoice_id=invoice_id,
                    date=payload.date,
                    patient_name=payload.patient_name,
                    patient_id=payload.patient_id,
                    department=payload.department or "General",
                    amount=Decimal("0.00"),  # Will be updated later
                    payment_method=payload.payment_method,
                    status=payload.status,
                    admission_date=payload.admission_date,
                    discharge_date=payload.discharge_date,
                    doctor=payload.doctor,
                    phone=payload.phone or patient.phone_number or "N/A",
                    email=payload.email or patient.email_address or "N/A",
                    address=payload.address or patient.address or "N/A",
                    tax_percent=payload.tax_percent,
                    transaction_id=payload.transaction_id,
                    payment_date=payload.payment_date or payload.date,
                )

                # 4. Create line items in HospitalInvoiceItem table
                subtotal = Decimal("0.00")
                items_for_pdf = []

                for idx, item in enumerate(payload.invoice_items, start=1):
                    line_total = Decimal(item.quantity) * item.unit_price

                    HospitalInvoiceItem.objects.create(
                        invoice=invoice,
                        s_no=idx,
                        description=item.description,
                        quantity=item.quantity,
                        unit_price=item.unit_price,
                        amount=line_total,
                    )

                    subtotal += line_total
                    items_for_pdf.append({
                        "s_no": idx,
                        "description": item.description,
                        "quantity": item.quantity,
                        "unit_price": float(item.unit_price),
                        "total": float(line_total),
                    })

                # 5. Final calculations
                tax_amount = (subtotal * payload.tax_percent / Decimal("100")).quantize(Decimal("0.01"))
                grand_total = (subtotal + tax_amount).quantize(Decimal("0.01"))

                # Update invoice amount
                invoice.amount = grand_total
                invoice.save()

                # 6. Link and update treatment charges if provided
                treatment_charges_updated = 0
                if payload.treatment_charge_ids:
                    # Update treatment charges to BILLED only if invoice status is Paid
                    if payload.status.upper() == "PAID":
                        updated = TreatmentCharge.objects.filter(
                            id__in=payload.treatment_charge_ids,
                            status="PENDING"
                        ).update(
                            status="BILLED",
                            hospital_invoice=invoice
                        )
                        treatment_charges_updated = updated
                    else:
                        # If not paid, just link them but keep status as PENDING
                        TreatmentCharge.objects.filter(
                            id__in=payload.treatment_charge_ids,
                            status="PENDING"
                        ).update(
                            hospital_invoice=invoice
                        )
                        # Status remains PENDING until invoice is paid

                # 7. Auto transaction ID
                if not invoice.transaction_id:
                    invoice.transaction_id = f"TXN_{invoice.invoice_id}"
                    invoice.save(update_fields=["transaction_id"])

                # 8. Render HTML
                template = env.get_template("invoice_template.html")
                html_string = template.render(
                    invoice=invoice,
                    items=items_for_pdf,
                    subtotal=float(subtotal),
                    tax_percent=float(payload.tax_percent),
                    tax_amount=float(tax_amount),
                    grand_total=float(grand_total),
                    amount_in_words=amount_to_words(grand_total),
                    today=date.today().strftime("%B %d, %Y"),
                )

                # 9. Generate PDF
                pdf_filename = f"{invoice.invoice_id}.pdf"
                pdf_path = os.path.join(PDF_OUTPUT_DIR, pdf_filename)

                HTML(string=html_string, base_url=APP_DIR).write_pdf(pdf_path)

                # 10. Save PDF path
                invoice.pdf_file = f"invoices_generator/{pdf_filename}"
                invoice.save(update_fields=["pdf_file"])

                return invoice, pdf_path, treatment_charges_updated

        invoice, pdf_path, treatment_charges_updated = await create_invoice_with_pdf()

        # Send notification
        await NotificationService.send_hospital_bill_generated({
            "invoice_id": invoice.invoice_id,
            "patient_name": invoice.patient_name,
            "amount": float(invoice.amount),
            "status": invoice.status,
            "treatment_charges_updated": treatment_charges_updated
        })

        # 11. Return PDF with success info
        response = FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename=f"{invoice.invoice_id}.pdf",
            headers={"Content-Disposition": f"inline; filename={invoice.invoice_id}.pdf"}
        )
        
        # Add custom headers with invoice info
        response.headers["X-Invoice-ID"] = invoice.invoice_id
        response.headers["X-Treatment-Charges-Updated"] = str(treatment_charges_updated)
        response.headers["X-Invoice-Status"] = invoice.status
        
        return response

    except HTTPException:
        raise
    except Exception as e:
        await NotificationService.send_billing_error(str(e), bill_type="Invoice Generation")
        raise HTTPException(status_code=500, detail=f"Failed to generate invoice: {str(e)}")


# -------------------------------
# Patient Treatment Charges Endpoint
# -------------------------------
@router.get("/patient/{patient_id}/treatment-charges", response_model=PatientTreatmentChargesResponse)
async def get_patient_treatment_charges(patient_id: str):
    """
    Get all pending treatment charges for a patient
    """
    try:
        # Fetch patient first
        @sync_to_async
        def fetch_patient():
            try:
                return Patient.objects.get(patient_unique_id=patient_id)
            except Patient.DoesNotExist:
                return None
        
        patient = await fetch_patient()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Fetch pending treatment charges
        @sync_to_async
        def fetch_charges(patient_obj):
            return list(TreatmentCharge.objects.filter(
                patient=patient_obj,
                status="PENDING"
            ).order_by("created_at"))
        
        charges = await fetch_charges(patient)
        
        # Calculate totals
        total_pending = sum(float(charge.amount) for charge in charges if charge.amount)
        
        # Calculate billed charges
        @sync_to_async
        def fetch_billed_charges(patient_obj):
            billed = TreatmentCharge.objects.filter(
                patient=patient_obj,
                status="BILLED"
            )
            return sum(float(charge.amount) for charge in billed if charge.amount)
        
        total_billed = await fetch_billed_charges(patient)
        
        # Format response
        charges_data = []
        for idx, charge in enumerate(charges):
            charges_data.append(TreatmentChargeSchema(
                id=charge.id,
                description=charge.description,
                quantity=charge.quantity,
                unit_price=float(charge.unit_price),
                amount=float(charge.amount) if charge.amount else 0,
                status=charge.status,
                created_at=format_date(charge.created_at)
            ))
        
        return PatientTreatmentChargesResponse(
            patient_id=patient_id,
            patient_name=patient.full_name,
            charges=charges_data,
            total_pending=total_pending,
            total_billed=total_billed
        )
        
    except Exception as e:
        await NotificationService.send_billing_error(
            str(e), 
            bill_type="Fetch Treatment Charges",
            reference_id=patient_id
        )
        raise HTTPException(status_code=500, detail=f"Failed to fetch treatment charges: {str(e)}")


# -------------------------------
# CRUD Endpoints
# -------------------------------
@router.get("/", response_model=List[InvoiceListSchema])
async def list_invoices():
    try:
        @sync_to_async
        def fetch_invoices():
            from django.db import connection
            # Clear query cache
            connection.queries_log.clear()
            
            # Get all invoices with proper ordering
            invoices = HospitalInvoiceHistory.objects.all().order_by("-id")
            
            # Debug logging
            print(f"Total invoices in database: {invoices.count()}")
            if invoices.count() > 0:
                recent = list(invoices[:5])
                print(f"Recent invoices (ID, invoice_id, date):")
                for inv in recent:
                    print(f"  - {inv.id}: {inv.invoice_id} - {inv.date} - {inv.patient_name}")
            
            return list(invoices)
        
        invoices = await fetch_invoices()
        
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
        print(f"Error in list_invoices: {e}")
        await NotificationService.send_billing_error(str(e), bill_type="Hospital Invoice List")
        raise HTTPException(status_code=500, detail="Failed to fetch invoices")


@router.get("/{invoice_id}", response_model=InvoiceDetailSchema)
async def get_invoice_detail(invoice_id: str):
    try:
        @sync_to_async
        def fetch_invoice():
            try:
                return HospitalInvoiceHistory.objects.prefetch_related("items").get(
                    invoice_id=invoice_id
                )
            except HospitalInvoiceHistory.DoesNotExist:
                return None
        
        invoice = await fetch_invoice()
        
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")

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

    except Exception as e:
        print(f"Error in get_invoice_detail for {invoice_id}: {e}")
        await NotificationService.send_billing_error(str(e), bill_type="Invoice Detail", reference_id=invoice_id)
        raise HTTPException(status_code=500, detail="Failed to fetch invoice details")


@router.post("/invoice/{invoice_id}/mark-paid")
async def mark_invoice_as_paid(invoice_id: str):
    """
    Mark invoice as paid and update linked treatment charges to BILLED
    """
    try:
        @sync_to_async
        def update_invoice_and_charges():
            with transaction.atomic():
                # Get invoice
                invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)
                
                # Update invoice status
                old_status = invoice.status
                invoice.status = "Paid"
                invoice.payment_date = timezone.now().date()
                invoice.save()
                
                # Update ALL treatment charges linked to this invoice to BILLED
                TreatmentCharge.objects.filter(
                    hospital_invoice=invoice
                ).update(status="BILLED")
                
                # Get count of updated charges
                updated_count = TreatmentCharge.objects.filter(
                    hospital_invoice=invoice,
                    status="BILLED"
                ).count()
                
                return invoice, old_status, updated_count
        
        invoice, old_status, updated_count = await update_invoice_and_charges()
        
        # Send notification
        await NotificationService.send_hospital_bill_generated({
            "invoice_id": invoice.invoice_id,
            "patient_name": invoice.patient_name,
            "amount": float(invoice.amount),
            "status": "Paid",
            "action": "status_update",
            "treatment_charges_updated": updated_count
        })
        
        return {
            "detail": f"Invoice {invoice_id} marked as Paid",
            "treatment_charges_updated": updated_count,
            "invoice": {
                "invoice_id": invoice.invoice_id,
                "status": invoice.status,
                "payment_date": format_date(invoice.payment_date)
            }
        }
        
    except HospitalInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
    except Exception as e:
        await NotificationService.send_billing_error(
            str(e), 
            bill_type="Mark Invoice Paid",
            reference_id=invoice_id
        )
        raise HTTPException(status_code=500, detail=f"Failed to update invoice: {str(e)}")


@router.delete("/{invoice_id}")
async def delete_invoice(invoice_id: str):
    try:
        @sync_to_async
        def delete_invoice_sync():
            invoice = HospitalInvoiceHistory.objects.get(invoice_id=invoice_id)

            # ✅ FIRST: Delete the PDF file from disk if it exists
            pdf_deleted = False
            if invoice.pdf_file:
                try:
                    # Get the actual file path
                    pdf_path = invoice.pdf_file.path
                    if os.path.exists(pdf_path):
                        os.remove(pdf_path)
                        pdf_deleted = True
                        print(f"Deleted PDF file: {pdf_path}")
                except Exception as e:
                    print(f"Error deleting PDF file: {e}")
            
            # ✅ Also check and delete from the invoices_generator folder
            try:
                pdf_filename = f"{invoice_id}.pdf"
                fallback_path = os.path.join(PDF_OUTPUT_DIR, pdf_filename)
                if os.path.exists(fallback_path):
                    os.remove(fallback_path)
                    pdf_deleted = True
                    print(f"Deleted PDF from fallback location: {fallback_path}")
            except Exception as e:
                print(f"Error deleting fallback PDF: {e}")

            # ✅ Reset any linked treatment charges back to PENDING
            treatment_charges_updated = TreatmentCharge.objects.filter(
                hospital_invoice=invoice
            ).update(
                status="PENDING",
                hospital_invoice=None
            )
            
            # ✅ Delete the invoice record
            invoice.delete()
            
            return {
                "pdf_deleted": pdf_deleted,
                "treatment_charges_updated": treatment_charges_updated
            }
        
        result = await delete_invoice_sync()
        
        await NotificationService.send_billing_error(
            f"Hospital invoice {invoice_id} deleted by user. PDF deleted: {result['pdf_deleted']}",
            bill_type="Invoice Deleted"
        )
        
        return {
            "detail": f"Invoice {invoice_id} deleted successfully",
            "pdf_deleted": result["pdf_deleted"],
            "treatment_charges_updated": result["treatment_charges_updated"]
        }
        
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

        # Validate PDF is linked in DB
        if not invoice.pdf_file:
            raise HTTPException(
                status_code=404,
                detail="PDF not generated for this invoice"
            )

        # Validate file exists on disk
        pdf_path = invoice.pdf_file.path
        if not os.path.exists(pdf_path):
            raise HTTPException(
                status_code=404,
                detail="PDF file missing on server"
            )
        
        invoice_data = get_invoice_data(invoice)
        await NotificationService.send_hospital_bill_generated(invoice_data)

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{invoice_id}.pdf",
            headers={
        "Content-Disposition": f"inline; filename={invoice_id}.pdf",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
    }
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
                        fallback = os.path.join(PDF_OUTPUT_DIR, f"{inv_id}.pdf")
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
# Export: CSV & Excel
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

        # Decimal Safe calculations
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

    # Create Excel file
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=hospital_invoices.xlsx"}
    )

# @router.post("/cleanup-orphaned-pdfs")
# async def cleanup_orphaned_pdfs():
#     """
#     Clean up PDF files that don't have corresponding database records
#     """
#     try:
#         @sync_to_async
#         def get_all_invoice_ids():
#             return list(HospitalInvoiceHistory.objects.values_list('invoice_id', flat=True))
        
#         invoice_ids = await get_all_invoice_ids()
#         print(f"Found {len(invoice_ids)} invoices in database")
        
#         deleted_files = []
        
#         # Check the invoices_generator directory
#         if os.path.exists(PDF_OUTPUT_DIR):
#             for filename in os.listdir(PDF_OUTPUT_DIR):
#                 if filename.endswith('.pdf'):
#                     # Extract invoice_id from filename (remove .pdf extension)
#                     file_invoice_id = filename[:-4]  # Remove '.pdf'
                    
#                     # Check if this invoice exists in database
#                     if file_invoice_id not in invoice_ids:
#                         file_path = os.path.join(PDF_OUTPUT_DIR, filename)
#                         try:
#                             os.remove(file_path)
#                             deleted_files.append(filename)
#                             print(f"Deleted orphaned PDF: {filename}")
#                         except Exception as e:
#                             print(f"Error deleting {filename}: {e}")
        
#         return {
#             "detail": f"Cleaned up {len(deleted_files)} orphaned PDF files",
#             "deleted_files": deleted_files,
#             "total_invoices_in_db": len(invoice_ids)
#         }
        
#     except Exception as e:
#         return {"error": str(e)}