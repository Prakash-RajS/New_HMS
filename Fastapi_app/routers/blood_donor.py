from fastapi import APIRouter, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, ValidationError
from typing import Optional, List
import os, django
from datetime import date
from django.db import IntegrityError  # ← ADD: For unique constraint errors

# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_project.settings")
django.setup()

from HMS_backend.models import Donor, BloodGroup

router = APIRouter()

# === Pydantic Schemas ===
class DonorSchema(BaseModel):
    donor_name: str
    gender: str
    blood_type: str
    phone: str
    last_donation_date: Optional[date] = None
    status: str

    class Config:
        extra = "forbid"

class DonorResponse(BaseModel):
    id: int
    donor_name: str
    gender: str
    blood_type: str
    phone: str
    last_donation_date: Optional[date]
    status: str

# === ADD DONOR ===
@router.post("/api/donors/add", response_model=DonorResponse)
async def add_donor(request: Request):
    body = await request.json()
    try:
        data = DonorSchema(**body)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

    def create_donor():
        try:
            # Use atomic transaction to prevent race conditions
            from django.db import transaction
            
            with transaction.atomic():
                # 1. Check if phone exists within the transaction
                if Donor.objects.filter(phone=data.phone).exists():
                    return {"error": "PHONE_EXISTS"}
                
                # 2. Create the donor
                donor = Donor.objects.create(
                    donor_name=data.donor_name,
                    gender=data.gender,
                    blood_type=data.blood_type,
                    phone=data.phone,
                    last_donation_date=data.last_donation_date,
                    status=data.status,
                )
                return donor
                
        except IntegrityError as e:
            if "phone" in str(e).lower():
                return {"error": "PHONE_EXISTS"}
            return {"error": "DATABASE_ERROR"}
        except Exception as e:
            if "is not a valid choice" in str(e):
                field = (
                    "blood_type" if "blood_type" in str(e) else
                    "gender" if "gender" in str(e) else
                    "status"
                )
                return {"error": f"INVALID_CHOICE:{field}"}
            return {"error": "SAVE_FAILED"}

    try:
        result = await run_in_threadpool(create_donor)
        
        # Check if result is an error dictionary
        if isinstance(result, dict) and "error" in result:
            error_msg = result["error"]
            if error_msg == "PHONE_EXISTS":
                raise HTTPException(
                    status_code=400,
                    detail="Phone number already exists. Please use a unique phone."
                )
            elif error_msg == "DATABASE_ERROR":
                raise HTTPException(status_code=400, detail="Database constraint violated.")
            elif error_msg.startswith("INVALID_CHOICE:"):
                field = error_msg.split(":")[1]
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value for {field}. Please select from allowed options."
                )
            elif error_msg == "SAVE_FAILED":
                raise HTTPException(status_code=500, detail="Failed to save donor.")
            else:
                raise HTTPException(status_code=500, detail="Unknown error occurred.")
        
        # Success case - return the created donor
        donor = result
        return DonorResponse(
            id=donor.id,
            donor_name=donor.donor_name,
            gender=donor.gender,
            blood_type=donor.blood_type,
            phone=donor.phone,
            last_donation_date=donor.last_donation_date,
            status=donor.status,
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in add_donor: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
        
# === FETCH DONORS ===
@router.get("/api/donors/list", response_model=List[DonorResponse])
async def fetch_donors():
    def get_all():
        return [
            DonorResponse(
                id=d.id,
                donor_name=d.donor_name,
                gender=d.gender,
                blood_type=d.blood_type,
                phone=d.phone,
                last_donation_date=d.last_donation_date,
                status=d.status,
            )
            for d in Donor.objects.all()
        ]

    return await run_in_threadpool(get_all)


# === EDIT DONOR ===
# === EDIT DONOR ===
@router.put("/api/donors/{donor_id}", response_model=DonorResponse)
async def edit_donor(donor_id: int, request: Request):
    body = await request.json()
    print(f"🟡 Editing donor {donor_id} with data: {body}")

    try:
        data = DonorSchema(**body)
    except ValidationError as e:
        print(f"❌ Validation error: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())

    def update():
        try:
            donor = Donor.objects.get(id=donor_id)
            print(f"🟡 Found donor: {donor.donor_name} (ID: {donor.id})")
            
            # Update each field
            for k, v in data.dict().items():
                print(f"🟡 Setting {k} to {v}")
                setattr(donor, k, v)
            
            donor.save()
            print(f"✅ Donor {donor_id} updated successfully")
            return donor
            
        except Donor.DoesNotExist:
            print(f"❌ Donor {donor_id} not found")
            raise HTTPException(status_code=404, detail="Donor not found.")
        except IntegrityError as e:
            print(f"❌ Integrity error: {str(e)}")
            if "phone" in str(e).lower():
                raise HTTPException(status_code=400, detail="Phone number already in use by another donor.")
            raise HTTPException(status_code=400, detail="Database constraint error.")
        except Exception as e:
            print(f"❌ Error updating donor: {str(e)}")
            if "is not a valid choice" in str(e):
                raise HTTPException(status_code=400, detail="Invalid value for blood type, gender, or status.")
            raise HTTPException(status_code=500, detail="Failed to update donor.")

    try:
        donor = await run_in_threadpool(update)
        return DonorResponse(
            id=donor.id,
            donor_name=donor.donor_name,
            gender=donor.gender,
            blood_type=donor.blood_type,
            phone=donor.phone,
            last_donation_date=donor.last_donation_date,
            status=donor.status,
        )
    except HTTPException:
        raise
    
# === DELETE DONOR ===
@router.delete("/api/donors/{donor_id}")
async def delete_donor(donor_id: int):
    def delete():
        try:
            donor = Donor.objects.get(id=donor_id)
            donor.delete()
        except Donor.DoesNotExist:
            raise HTTPException(status_code=404, detail="Donor not found.")

    await run_in_threadpool(delete)
    return {"success": True, "message": "Donor deleted successfully"}