from fastapi import APIRouter, HTTPException 
from pydantic import BaseModel
from typing import List, Optional
from asgiref.sync import sync_to_async
from datetime import datetime

from HMS_backend.models import Patient, MedicineAllocation, Stock

router = APIRouter(prefix="/pharmacy-billing", tags=["Pharmacy Billing"])

# ---------- Pydantic Response Models ----------

class PharmacyBillingItem(BaseModel):
    item_code: str
    name_of_drug: str
    rack_no: Optional[str] = None
    shelf_no: Optional[str] = None
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    frequency: Optional[str] = None
    dosage: Optional[str] = None
    duration: Optional[str] = None
    allocation_date: Optional[str] = None  # New field to show allocation date

class PharmacyBillingResponse(BaseModel):
    patient_name: str
    patient_unique_id: str
    billing_date: str
    total_items: int
    total_amount: float
    items: List[PharmacyBillingItem]

# ---------- Fetch Pharmacy Billing Data ----------
@router.get("/{patient_id}/", response_model=PharmacyBillingResponse)
async def get_pharmacy_billing_details(patient_id: int):
    """
    Fetch all medicines prescribed to a patient along with stock details.
    Used for the Pharmacy Billing Page.
    """
    try:
        # Fetch patient
        patient = await sync_to_async(Patient.objects.get)(id=patient_id)

        # Fetch all medicine allocations for this patient
        allocations = await sync_to_async(list)(
            MedicineAllocation.objects.filter(patient=patient).all()
        )

        if not allocations:
            raise HTTPException(status_code=404, detail="No medicine allocations found for this patient")

        billing_items = []
        total_amount = 0.0

        for allocation in allocations:
            # Match with stock using medicine name
            stock = await sync_to_async(
                Stock.objects.filter(product_name__iexact=allocation.medicine_name).first
            )()

            # Safely get unit_price from stock
            unit_price = float(stock.unit_price) if stock and stock.unit_price else 0.0

            # Safely get quantity from allocation
            try:
                quantity = int(allocation.quantity)
            except (TypeError, ValueError):
                quantity = 0

            item = PharmacyBillingItem(
                item_code=stock.item_code if stock else "N/A",
                name_of_drug=allocation.medicine_name,
                rack_no=stock.rack_no if stock else None,
                shelf_no=stock.shelf_no if stock else None,
                quantity=quantity,
                unit_price=unit_price,
                frequency=allocation.frequency,
                dosage=allocation.dosage,
                duration=allocation.duration,
                allocation_date=allocation.allocation_date.strftime("%d-%m-%Y") if allocation.allocation_date else None
            )

            billing_items.append(item)
            total_amount += unit_price * quantity  # multiply by prescribed quantity

        response = PharmacyBillingResponse(
            patient_name=patient.full_name,
            patient_unique_id=patient.patient_unique_id,
            billing_date=datetime.now().strftime("%d-%m-%Y %H:%M"),
            total_items=len(billing_items),
            total_amount=total_amount,
            items=billing_items
        )

        return response

    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
