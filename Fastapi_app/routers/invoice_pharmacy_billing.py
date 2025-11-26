
#fastapi_app/routers/invoice_pharmacy_billing.py
#fastapi_app/routers/invoice_pharmacy_billing.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os
from decimal import Decimal
from datetime import date
from HMS_backend.models import Stock

# --------------
# Django Setup
# --------------
import sys
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
django.setup()

from django.db import transaction    #  <-- ADDED
from HMS_backend.models import PharmacyInvoiceHistory, PharmacyInvoiceItem

router = APIRouter()

# ------------------------------
# Path Setup
# ------------------------------
APP_DIR = os.path.dirname(os.path.dirname(__file__))   # fastapi_app/
TEMPLATE_DIR = os.path.join(APP_DIR, "frontend")       # fastapi_app/frontend/
INVOICE_OUTPUT_DIR = os.path.join(APP_DIR, "pharmacy", "invoices")

os.makedirs(INVOICE_OUTPUT_DIR, exist_ok=True)

env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


# ------------------------------
# Number to Words
# ------------------------------
def number_to_words(amount):
    try:
        from num2words import num2words
        return num2words(int(amount), to="cardinal").title() + " Only"
    except:
        return str(amount)


# ------------------------------
# Auto Generate Invoice Number
# ------------------------------
def generate_invoice_number():
    last_invoice = PharmacyInvoiceHistory.objects.order_by("-id").first()

    if not last_invoice:
        return "SINV-0001"

    try:
        last_number = int(last_invoice.bill_no.split("-")[1])
    except:
        last_number = 0

    new_number = last_number + 1
    return f"SINV-{new_number:04d}"


# ------------------------------
# Pydantic Models
# ------------------------------
class InvoiceItemSchema(BaseModel):
    sl_no: int
    item_code: str
    drug_name: str
    rack_no: str
    shelf_no: str
    quantity: int
    unit_price: float
    discount_pct: float
    tax_pct: float


class InvoiceSchema(BaseModel):
    patient_name: str
    patient_id: str
    age: int
    doctor_name: str
    billing_staff: str
    staff_id: str
    patient_type: str
    address_text: str
    payment_type: str
    payment_status: str
    payment_mode: str
    bill_date: date
    discount_amount: float
    cgst_percent: float
    sgst_percent: float
    items: List[InvoiceItemSchema]


def reduce_stock_quantities(items):
    """
    Reduce stock quantities for all items in the invoice
    """
    stock_updates = []
    
    for item in items:
        try:
            stock_item = Stock.objects.get(
                item_code=item.item_code,
                product_name=item.drug_name
            )
            
            if stock_item.quantity < item.quantity:
                raise ValueError(
                    f"Insufficient stock for {item.drug_name}. "
                    f"Required: {item.quantity}, Available: {stock_item.quantity}"
                )
            
            stock_item.quantity -= item.quantity
            
            if stock_item.quantity == 0:
                stock_item.status = 'outofstock'
            
            stock_updates.append(stock_item)
            
        except Stock.DoesNotExist:
            raise ValueError(f"Stock item not found: {item.drug_name} (Code: {item.item_code})")
    
    for stock_item in stock_updates:
        stock_item.save()
    
    return True


# ---------------------------------------------------------
#  POST API — Insert + Generate PDF (ATOMIC TRANSACTION)
# ---------------------------------------------------------
@router.post("/create-pharmacy-invoice", tags=["Pharmacy Invoice"])
def create_pharmacy_invoice(data: InvoiceSchema):
    try:
        with transaction.atomic():   #  <-- FULL ATOMIC BLOCK ADDED
            # -------------------
            # Auto-generate number
            # -------------------
            auto_bill_no = generate_invoice_number()

            # --------------------------------------------
            # CALCULATE TOTALS
            # --------------------------------------------
            items_with_totals = []
            subtotal = Decimal("0.00")

            for item in data.items:
                line_total = Decimal(item.quantity) * Decimal(item.unit_price)
                subtotal += line_total

                items_with_totals.append({
                    "sl_no": item.sl_no,
                    "item_code": item.item_code,
                    "drug_name": item.drug_name,
                    "rack_no": item.rack_no,
                    "shelf_no": item.shelf_no,
                    "quantity": item.quantity,
                    "unit_price": float(item.unit_price),
                    "discount_pct": float(item.discount_pct),
                    "tax_pct": float(item.tax_pct),
                    "line_total": float(line_total)
                })

            cgst_amount = (subtotal * Decimal(data.cgst_percent) / 100)
            sgst_amount = (subtotal * Decimal(data.sgst_percent) / 100)
            tax_total = cgst_amount + sgst_amount

            grand_total = subtotal + tax_total - Decimal(data.discount_amount)

            # --------------------------------------------
            # REDUCE STOCK QUANTITIES
            # --------------------------------------------
            reduce_stock_quantities(data.items)

            # --------------------------------------------
            # SAVE Invoice Header
            # --------------------------------------------
            invoice = PharmacyInvoiceHistory.objects.create(
                bill_no=auto_bill_no,
                patient_name=data.patient_name,
                patient_id=data.patient_id,
                age=data.age,
                doctor_name=data.doctor_name,
                billing_staff=data.billing_staff,
                staff_id=data.staff_id,
                patient_type=data.patient_type,
                address_text=data.address_text,
                payment_type=data.payment_type,
                payment_status=data.payment_status,
                payment_mode=data.payment_mode,
                bill_date=data.bill_date,
                subtotal=float(subtotal),
                cgst_percent=data.cgst_percent,
                sgst_percent=data.sgst_percent,
                cgst_amount=float(cgst_amount),
                sgst_amount=float(sgst_amount),
                discount_amount=data.discount_amount,
                net_amount=float(grand_total),
            )

            # --------------------------------------------
            # SAVE Line Items
            # --------------------------------------------
            for item in items_with_totals:
                PharmacyInvoiceItem.objects.create(
                    invoice=invoice,
                    sl_no=item["sl_no"],
                    item_code=item["item_code"],
                    drug_name=item["drug_name"],
                    rack_no=item["rack_no"],
                    shelf_no=item["shelf_no"],
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    discount_pct=item["discount_pct"],
                    tax_pct=item["tax_pct"],
                    line_total=item["line_total"],
                )

            # --------------------------------------------
            # Prepare Data for Template (NO CHANGE)
            # --------------------------------------------
            db_invoice = PharmacyInvoiceHistory.objects.get(id=invoice.id)
            db_items = PharmacyInvoiceItem.objects.filter(invoice=db_invoice).order_by("sl_no")

            amount_words = number_to_words(grand_total)

            template = env.get_template("invoice_pharmacy_template.html")

            html_content = template.render(
                invoice=db_invoice,
                items=db_items,
                amount_in_words=amount_words,
                tax_total=float(tax_total),
                tax_percent=float(data.cgst_percent + data.sgst_percent),
            )

            # --------------------------------------------
            # Generate PDF (NO CHANGE)
            # --------------------------------------------
            pdf_filename = f"{db_invoice.bill_no}.pdf"
            pdf_path = os.path.join(INVOICE_OUTPUT_DIR, pdf_filename)

            try:
                HTML(string=html_content, base_url=TEMPLATE_DIR).write_pdf(pdf_path)
                print(f"PDF generated successfully at: {pdf_path}")
            except Exception as pdf_error:
                print(f"PDF generation error: {pdf_error}")
                raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(pdf_error)}")

            db_invoice.path = os.path.abspath(pdf_path)
            db_invoice.save()

            if not os.path.exists(pdf_path):
                raise HTTPException(status_code=500, detail="PDF file was not created")

        # Return file AFTER successful transaction
        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename=pdf_filename,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"General error in create_pharmacy_invoice: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating invoice: {str(e)}")


# ---------------------------------------------------------
#  GET API — Get PDF by Invoice Number
# ---------------------------------------------------------
@router.get("/get-pharmacy-invoice/{bill_no}", tags=["Pharmacy Invoice"])
def get_pharmacy_invoice(bill_no: str):
    try:
        invoice = PharmacyInvoiceHistory.objects.get(bill_no=bill_no)
        if not invoice.path or not os.path.exists(invoice.path):
            raise HTTPException(status_code=404, detail="PDF not found")
        
        return FileResponse(
            path=invoice.path,
            media_type="application/pdf",
            filename=f"{bill_no}.pdf",
        )
    except PharmacyInvoiceHistory.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")
