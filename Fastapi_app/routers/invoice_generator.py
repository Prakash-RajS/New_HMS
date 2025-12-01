# from fastapi import APIRouter, HTTPException
# from fastapi.responses import StreamingResponse
# from pydantic import BaseModel
# from datetime import date as dt_date
# from typing import List
# import io
# from pathlib import Path

# # Django imports
# from HMS_backend.models import Invoice
# from django.forms.models import model_to_dict
# from django.core.files.base import ContentFile

# # PDF
# from jinja2 import Environment, FileSystemLoader
# from xhtml2pdf import pisa


# router = APIRouter(prefix="/invoices", tags=["Invoice Generator"])


# # ==================== Pydantic Schemas ====================
# class ItemSchema(BaseModel):
#     desc: str
#     qty: int
#     unit_price: float

#     @property
#     def total(self) -> float:
#         return round(self.qty * self.unit_price, 2)


# class InvoiceCreateInputSchema(BaseModel):
#     date: dt_date
#     patient_name: str
#     patient_id: str
#     department: str
#     payment_method: str
#     status: str = "PAID"

#     admission_date: dt_date
#     discharge_date: dt_date
#     doctor: str
#     phone: str
#     email: str
#     address: str
#     items: List[ItemSchema]
#     tax_percent: float = 18.0
#     transaction_id: str | None = None
#     payment_date: str | None = None

#     @property
#     def subtotal(self) -> float:
#         return round(sum(item.total for item in self.items), 2)

#     @property
#     def tax(self) -> float:
#         return round(self.subtotal * self.tax_percent / 100, 2)

#     @property
#     def amount(self) -> float:
#         return round(self.subtotal + self.tax, 2)


# class InvoiceResponseSchema(InvoiceCreateInputSchema):
#     invoice_id: str
#     items: List[ItemSchema]


# # ==================== Helper: Number to Words ====================
# def number_to_words(amount: float) -> str:
#     ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
#     teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
#              "Seventeen", "Eighteen", "Nineteen"]
#     tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

#     def helper(n: int) -> str:
#         if n == 0: return ""
#         if n < 10: return ones[n]
#         if n < 20: return teens[n-10]
#         if n < 100: return tens[n//10] + (" " + ones[n%10] if n%10 else "")
#         if n < 1000: return ones[n//100] + " Hundred" + (" " + helper(n%100) if n%100 else "")
#         return "Large Number"

#     integer = int(amount)
#     cents = round((amount - integer) * 100)
#     result = helper(integer) + " Dollars"
#     if cents:
#         result += f" and {cents} Cents"
#     return result.strip() + " only"


# # ==================== PDF Renderer ====================
# def _get_template_dir() -> Path:
#     this_file = Path(__file__).resolve()
#     candidate = this_file.parent.parent / "frontend"
#     if not candidate.is_dir():
#         raise RuntimeError("frontend/ folder not found")
#     return candidate


# def render_pdf(data: dict) -> bytes:
#     env = Environment(loader=FileSystemLoader(str(_get_template_dir())))
#     template = env.get_template("invoice_template.html")
#     html = template.render(**data)

#     buffer = io.BytesIO()
#     pisa_status = pisa.CreatePDF(html, dest=buffer, encoding="UTF-8")
#     if pisa_status.err:
#         raise RuntimeError(f"PDF error: {pisa_status.err}")
#     buffer.seek(0)
#     return buffer.read()


# # ==================== Endpoints ====================
# @router.post("/", response_model=InvoiceResponseSchema)
# def create_invoice(payload: InvoiceCreateInputSchema):
#     line_items = [
#         {"desc": i.desc, "qty": i.qty, "unit_price": i.unit_price, "total": i.total}
#         for i in payload.items
#     ]

#     inv = Invoice.objects.create(
#         date=payload.date,
#         patient_name=payload.patient_name,
#         patient_id=payload.patient_id,
#         department=payload.department,
#         amount=payload.amount,
#         payment_method=payload.payment_method,
#         status=payload.status,
#         admission_date=payload.admission_date,
#         discharge_date=payload.discharge_date,
#         doctor=payload.doctor,
#         phone=payload.phone,
#         email=payload.email,
#         address=payload.address,
#         invoice_items=line_items,
#         tax_percent=payload.tax_percent,
#         transaction_id=payload.transaction_id,
#         payment_date=payload.payment_date,
#     )

#     data = model_to_dict(inv)
#     data["items"] = [
#         ItemSchema(desc=item["desc"], qty=item["qty"], unit_price=item["unit_price"])
#         for item in data.pop("invoice_items", [])
#     ]
#     return InvoiceResponseSchema(**data)


# @router.get("/{invoice_id}/pdf")
# def download_pdf(invoice_id: str):
#     try:
#         inv = Invoice.objects.get(invoice_id=invoice_id)
#     except Invoice.DoesNotExist:
#         raise HTTPException(404, "Invoice not found")

#     line_items = inv.invoice_items
#     subtotal = sum(i["total"] for i in line_items)
#     tax = round(subtotal * float(inv.tax_percent) / 100, 2)

#     template_data = {
#         "invoice": {
#             "invoice_id": inv.invoice_id,
#             "date": inv.date,
#             "patient_name": inv.patient_name,
#             "patient_id": inv.patient_id,
#             "department": inv.department,
#             "amount": float(inv.amount),
#             "payment_method": inv.payment_method,
#             "status": inv.status,
#             "admission_date": inv.admission_date,
#             "discharge_date": inv.discharge_date,
#             "doctor": inv.doctor,
#             "phone": inv.phone,
#             "email": inv.email,
#             "address": inv.address,
#             "items": line_items,
#             "tax_percent": float(inv.tax_percent),
#             "subtotal": subtotal,
#             "tax": tax,
#             "amount_in_words": number_to_words(float(inv.amount)),
#             "transaction_id": inv.transaction_id or "N/A",
#             "payment_date": inv.payment_date or "N/A",
#         }
#     }

#     # ✅ Generate PDF
#     pdf_bytes = render_pdf(template_data)

#     # ✅ Save PDF file
#     current_dir = Path(__file__).resolve().parent
#     output_dir = current_dir / "generated_invoices"
#     output_dir.mkdir(parents=True, exist_ok=True)

#     pdf_filename = f"invoice_{invoice_id}.pdf"
#     output_path = output_dir / pdf_filename

#     with open(output_path, "wb") as f:
#         f.write(pdf_bytes)

#     # ✅ Save path in DB if not saved
#     if not inv.pdf_file:
#         inv.pdf_file.save(pdf_filename, ContentFile(pdf_bytes))
#         inv.save()

#     # ✅ Return response
#     return StreamingResponse(
#         io.BytesIO(pdf_bytes),
#         media_type="application/pdf",
#         headers={"Content-Disposition": f'attachment; filename="{pdf_filename}"'}
#     )
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from decimal import Decimal
from datetime import date
import os
import sys

# ----------------- Django setup -----------------
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django.setup()

from HMS_backend.models import HospitalInvoiceHistory, Patient

# ----------------- Paths -----------------
APP_DIR = os.path.join(BASE_DIR, "fastapi_app")
TEMPLATE_DIR = os.path.join(APP_DIR, "frontend")
PDF_OUTPUT_DIR = os.path.join(APP_DIR, "invoices_generator")

os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)

# ----------------- Jinja2 -----------------
from jinja2 import Environment, FileSystemLoader, select_autoescape

env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    autoescape=select_autoescape(["html", "xml"])
)

# ----------------- WeasyPrint -----------------
from weasyprint import HTML

# ----------------- Num2Words -----------------
try:
    from num2words import num2words
except:
    num2words = None

router = APIRouter()


# ===================== Pydantic Schemas =====================

class InvoiceItemIn(BaseModel):
    description: str
    quantity: int
    unit_price: Decimal

class InvoiceCreateIn(BaseModel):
    date: date
    patient_name: str
    patient_id: str
    department: str
    payment_method: str
    status: str = "Paid"

    admission_date: date
    discharge_date: Optional[date] = None
    doctor: str
    phone: str
    email: EmailStr
    address: str

    invoice_items: List[InvoiceItemIn]
    tax_percent: Decimal = Decimal("18.0")
    transaction_id: Optional[str] = None
    payment_date: Optional[str] = None


# ===================== Helper =====================

def amount_to_words(amount: Decimal) -> str:
    if num2words:
        try:
            return f"{num2words(amount, lang='en').title()} Only"
        except:
            return f"{amount} Only"
    return f"{amount} Only"


# ===================== API =====================

@router.post("/hospital-invoices/generate", response_class=FileResponse)
def generate_invoice_pdf(payload: InvoiceCreateIn):

    if not payload.invoice_items:
        raise HTTPException(status_code=400, detail="At least one invoice item is required.")

    # Fetch patient
    try:
        patient = Patient.objects.get(patient_unique_id=payload.patient_id)
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")

    # ---- Calculations ----
    subtotal = sum((item.quantity * item.unit_price for item in payload.invoice_items), Decimal("0.00"))
    tax_amount = (subtotal * payload.tax_percent / Decimal("100")).quantize(Decimal("0.01"))
    grand_total = (subtotal + tax_amount).quantize(Decimal("0"))

    # Convert items to JSON-serializable
    items_data = [
        {
            "description": i.description,
            "quantity": int(i.quantity),
            "unit_price": float(i.unit_price),
            "total": float(i.quantity * i.unit_price)
        }
        for i in payload.invoice_items
    ]

    # ---- Save invoice ----
    invoice = HospitalInvoiceHistory(
        date=payload.date,
        patient_name=payload.patient_name,
        patient_id=payload.patient_id,
        department=payload.department,
        amount=grand_total,
        payment_method=payload.payment_method,
        status=payload.status,

        admission_date=payload.admission_date,
        discharge_date=payload.discharge_date,
        doctor=payload.doctor,
        phone=patient.phone_number if patient.phone_number else "N/A",
        email=str(payload.email),
        address=payload.address,

        invoice_items=items_data,
        tax_percent=payload.tax_percent,
        transaction_id=payload.transaction_id,
        payment_date=payload.payment_date,
    )
    invoice.save()

    # Auto-generate transaction ID if missing
    if not invoice.transaction_id:
        invoice.transaction_id = f"TXN_{invoice.invoice_id}"
        invoice.save(update_fields=["transaction_id"])

    # ---- Render HTML ----
    template = env.get_template("invoice_template.html")
    html_string = template.render(
        invoice_number=invoice.invoice_id,
        invoice=invoice,
        subtotal=subtotal,
        tax_amount=tax_amount,
        grand_total=grand_total,
        amount_in_words=amount_to_words(grand_total),
        transaction_id=invoice.transaction_id,

        invoice_date_display=invoice.date.strftime("%B %d, %Y"),
        admission_date_display=invoice.admission_date.strftime("%d-%m-%Y"),
        discharge_date_display=invoice.discharge_date.strftime("%d-%m-%Y") if invoice.discharge_date else "-",
        invoice_address_html=invoice.address.replace("\n", "<br/>"),
    )

    # ---- PDF Name (Matches Invoice ID) ----
    pdf_filename = f"{invoice.invoice_id}.pdf"
    pdf_path = os.path.join(PDF_OUTPUT_DIR, pdf_filename)

    # ---- Generate PDF ----
    HTML(string=html_string, base_url=APP_DIR).write_pdf(pdf_path)

    invoice.pdf_file.name = f"invoices_generator/{pdf_filename}"
    invoice.save(update_fields=["pdf_file"])

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=pdf_filename
    )

