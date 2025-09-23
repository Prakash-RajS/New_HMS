from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from HMS_backend.models import Invoice
from datetime import date
from typing import List
from django.forms.models import model_to_dict
import csv
import io
from fastapi.responses import StreamingResponse
import openpyxl

router = APIRouter(prefix="/billing", tags=["Billing Management"])


# -------------------------------
# Pydantic Schema
# -------------------------------
class InvoiceSchema(BaseModel):
    invoice_id: str
    date: date
    patient_name: str
    patient_id: str
    department: str
    amount: float
    payment_method: str
    status: str


# -------------------------------
# CRUD Endpoints
# -------------------------------
@router.post("/", response_model=InvoiceSchema)
def create_invoice(data: InvoiceSchema):
    invoice = Invoice.objects.create(**data.dict())
    return model_to_dict(invoice)


@router.get("/", response_model=List[InvoiceSchema])
def list_invoices():
    invoices = Invoice.objects.all()
    return [model_to_dict(inv) for inv in invoices]


@router.get("/{invoice_id}", response_model=InvoiceSchema)
def get_invoice(invoice_id: str):
    try:
        invoice = Invoice.objects.get(invoice_id=invoice_id)
        return model_to_dict(invoice)
    except Invoice.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")


@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: str):
    try:
        invoice = Invoice.objects.get(invoice_id=invoice_id)
        invoice.delete()
        return {"detail": f"Invoice {invoice_id} deleted successfully"}
    except Invoice.DoesNotExist:
        raise HTTPException(status_code=404, detail="Invoice not found")


# -------------------------------
# Export Endpoints
# -------------------------------
@router.get("/export/csv")
def export_invoices_csv():
    invoices = Invoice.objects.all().values(
        "invoice_id", "date", "patient_name", "patient_id",
        "department", "amount", "payment_method", "status"
    )

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=invoices[0].keys() if invoices else [])
    writer.writeheader()
    writer.writerows(invoices)

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=invoices.csv"}
    )


@router.get("/export/excel")
def export_invoices_excel():
    invoices = Invoice.objects.all().values(
        "invoice_id", "date", "patient_name", "patient_id",
        "department", "amount", "payment_method", "status"
    )

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Invoices"

    if invoices:
        ws.append(list(invoices[0].keys()))  # headers
        for row in invoices:
            ws.append(list(row.values()))

    output = io.BytesIO()
    wb.save(output)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=invoices.xlsx"}
    )
