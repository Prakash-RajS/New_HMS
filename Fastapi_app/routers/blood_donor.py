from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import django, os

# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_project.settings")
django.setup()

from HMS_backend.models import BloodGroup, Donor  # adjust app name

router = APIRouter(prefix="/donors", tags=["Donors"])

# ================== SCHEMAS ==================
class DonorSchema(BaseModel):
    donor_name: str
    gender: str
    blood_type: str
    phone: str
    last_donation_date: Optional[date] = None

class DonorResponse(BaseModel):
    id: int
    donor_name: str
    gender: str
    blood_type: str
    phone: str
    last_donation_date: Optional[date]
    status: str

# ================== ROUTES ==================
# 1️⃣ Add Donor
# 1️⃣ Add Donor
@router.post("/add", response_model=DonorResponse)
def add_donor(data: DonorSchema):
    if Donor.objects.filter(phone=data.phone).exists():
        raise HTTPException(status_code=400, detail="Donor with this phone already exists")

    donor = Donor.objects.create(
        donor_name=data.donor_name,
        gender=data.gender,
        blood_type=data.blood_type,
        phone=data.phone,
        last_donation_date=data.last_donation_date,
        status="Not Eligible",  # new donors are not eligible immediately
    )

    # 🔹 Update blood stock (+1 unit for the given blood group)
    bg, _ = BloodGroup.objects.get_or_create(blood_type=donor.blood_type)
    bg.available_units += 1
    bg.update_status()

    donor.check_eligibility()

    return DonorResponse(
        id=donor.id,
        donor_name=donor.donor_name,
        gender=donor.gender,
        blood_type=donor.blood_type,
        phone=donor.phone,
        last_donation_date=donor.last_donation_date,
        status=donor.status,
    )


# 2️⃣ Edit Donor (update info or donation)
@router.put("/{donor_id}", response_model=DonorResponse)
def edit_donor(donor_id: int, data: DonorSchema, units: Optional[int] = 0):
    try:
        donor = Donor.objects.get(id=donor_id)
    except Donor.DoesNotExist:
        raise HTTPException(status_code=404, detail="Donor not found")

    # Update donor fields
    donor.donor_name = data.donor_name
    donor.gender = data.gender
    donor.blood_type = data.blood_type
    donor.phone = data.phone

    if data.last_donation_date:
        donor.last_donation_date = data.last_donation_date
        donor.status = "Not Eligible"

        # Update blood stock if donation recorded
        if units and units > 0:
            bg, _ = BloodGroup.objects.get_or_create(blood_type=donor.blood_type)
            bg.available_units += units
            bg.update_status()

    donor.check_eligibility()
    donor.save()

    return DonorResponse(
        id=donor.id,
        donor_name=donor.donor_name,
        gender=donor.gender,
        blood_type=donor.blood_type,
        phone=donor.phone,
        last_donation_date=donor.last_donation_date,
        status=donor.status,
    )

# 3️⃣ Fetch Donors
@router.get("/list", response_model=List[DonorResponse])
def fetch_donors():
    donors = Donor.objects.all()
    results = []
    for d in donors:
        d.check_eligibility()
        results.append(
            DonorResponse(
                id=d.id,
                donor_name=d.donor_name,
                gender=d.gender,
                blood_type=d.blood_type,
                phone=d.phone,
                last_donation_date=d.last_donation_date,
                status=d.status,
            )
        )
    return results
