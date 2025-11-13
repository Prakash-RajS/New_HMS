from fastapi import APIRouter, HTTPException, status, Form
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from HMS_backend.models import BedGroup, Bed, Patient  # Django models
import django.db.models as models
from datetime import datetime

router = APIRouter(prefix="/bedgroups", tags=["Bed Groups"])

# ---------------------------
# Pydantic Schemas
# ---------------------------

class BedGroupBase(BaseModel):
    bedGroup: str
    capacity: int


class BedGroupCreate(BedGroupBase):
    pass


class PatientInfo(BaseModel):
    id: str
    name: str
    admission_date: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)


class BedBase(BaseModel):
    bed_number: int
    is_occupied: bool


class BedResponse(BedBase):
    id: int
    patient: Optional[PatientInfo] = None
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)


class BedGroupResponse(BedGroupBase):
    id: int
    occupied: int
    unoccupied: int
    status: str
    beds: List[BedResponse] = []
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)

    @classmethod
    def from_orm_with_beds(cls, group: BedGroup):
        """Safely convert Django ORM object to Pydantic model without recursion"""
        beds = []
        for bed in group.beds.all():
            patient_info = None
            if bed.patient_id:
                patient_obj = bed.patient
                patient_info = PatientInfo(
                    id=str(patient_obj.patient_unique_id),
                    name=str(patient_obj.full_name),
                    admission_date=patient_obj.admission_date,
                )
            beds.append(
                BedResponse(
                    id=bed.id,
                    bed_number=bed.bed_number,
                    is_occupied=bed.is_occupied,
                    patient=patient_info,
                )
            )

        return cls(
            id=group.id,
            bedGroup=group.bedGroup,
            capacity=group.capacity,
            occupied=group.occupied,
            unoccupied=group.unoccupied,
            status=group.status,
            beds=beds,
        )


# ---------------------------
# Helper
# ---------------------------

def _next_bed_number() -> int:
    """Return the next free global bed number."""
    last = Bed.objects.aggregate(max_num=models.Max("bed_number"))["max_num"]
    return (last or 0) + 1


# ---------------------------
# Routes
# ---------------------------

# CREATE – auto-generate global bed numbers
@router.post("/add", response_model=BedGroupResponse)
def create_bed_group(group: BedGroupCreate):
    if BedGroup.objects.filter(bedGroup=group.bedGroup).exists():
        raise HTTPException(status_code=400, detail="Bed group already exists")

    start = _next_bed_number()
    new_group = BedGroup.objects.create(
        bedGroup=group.bedGroup,
        capacity=group.capacity,
        occupied=0,
        unoccupied=group.capacity,
        status="Available",
    )

    # Create beds with global numbers
    for offset in range(group.capacity):
        Bed.objects.create(
            bed_number=start + offset,
            bed_group=new_group,
            is_occupied=False,
        )

    return BedGroupResponse.from_orm_with_beds(new_group)


# GET ALL
@router.get("/all", response_model=List[BedGroupResponse])
def get_bed_groups():
    groups = BedGroup.objects.all()
    return [BedGroupResponse.from_orm_with_beds(g) for g in groups]


# GET BEDS OF A GROUP
@router.get("/{group_id}/beds", response_model=BedGroupResponse)
def get_beds(group_id: int):
    try:
        group = BedGroup.objects.get(id=group_id)
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    return BedGroupResponse.from_orm_with_beds(group)


# ADMIT PATIENT – UPDATE EXISTING PATIENT ROW (NO NEW CREATION)
@router.post("/admit", response_model=Dict[str, Any])
def admit_patient(
    full_name: str = Form(...),
    patient_unique_id: str = Form(...),  # Manual ID from registration
    bed_group_name: str = Form(...),
    bed_number: int = Form(...),
    admission_date: str = Form(...),  # Format: MM/DD/YYYY
):
    # Parse date
    try:
        admit_date = datetime.strptime(admission_date, "%m/%d/%Y").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use MM/DD/YYYY")

    # Find existing patient by ID
    try:
        patient = Patient.objects.get(patient_unique_id=patient_unique_id)
        if patient.full_name != full_name:
            raise HTTPException(status_code=400, detail="Patient ID exists with different name")
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found. Register first.")

    # --- Prevent double admission ---
    if hasattr(patient, "beds") and patient.beds.filter(is_occupied=True).exists():
        current_bed = patient.beds.filter(is_occupied=True).first()
        raise HTTPException(
            status_code=400,
            detail=f"Patient is already admitted in Bed {current_bed.bed_number} "
                   f"({current_bed.bed_group.bedGroup}). Discharge first to admit to a new bed.",
        )

    # Find bed
    try:
        bed_group = BedGroup.objects.get(bedGroup=bed_group_name)
        bed = Bed.objects.get(bed_group=bed_group, bed_number=bed_number)
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    except Bed.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed not found")

    if bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already occupied")

    # Update patient details
    patient.admission_date = admit_date
    patient.room_number = str(bed_number)
    patient.save()

    # Allocate bed
    bed.is_occupied = True
    bed.patient = patient
    bed.save()

    # Refresh group counts dynamically
    bed_group.refresh_counts()

    return {
        "success": True,
        "message": "Patient admitted and bed allocated",
        "patient": {
            "id": patient.patient_unique_id,
            "name": patient.full_name,
            "admission_date": admit_date.strftime("%m/%d/%Y"),
        },
        "bed": {
            "number": bed.bed_number,
            "group": bed_group.bedGroup,
        },
    }


# VACATE BED (Discharge)
@router.post("/{group_id}/beds/{bed_number}/vacate", response_model=BedGroupResponse)
def vacate_bed(group_id: int, bed_number: int):
    try:
        group = BedGroup.objects.get(id=group_id)
        bed = Bed.objects.get(bed_group=group, bed_number=bed_number)
    except (BedGroup.DoesNotExist, Bed.DoesNotExist):
        raise HTTPException(status_code=404, detail="Bed or Bed group not found")

    if not bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already vacant")

    # Update discharge date on patient
    if bed.patient:
        bed.patient.discharge_date = datetime.now().date()
        bed.patient.save()

    bed.is_occupied = False
    bed.patient = None
    bed.save()

    # Automatically refresh group counts
    group.refresh_counts()

    return BedGroupResponse.from_orm_with_beds(group)


# UPDATE BED GROUP
@router.put("/{group_id}/", response_model=BedGroupResponse)
def update_bed_group(group_id: int, group_update: BedGroupCreate):
    try:
        bed_group = BedGroup.objects.get(id=group_id)
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")

    if BedGroup.objects.filter(bedGroup=group_update.bedGroup).exclude(id=group_id).exists():
        raise HTTPException(status_code=400, detail="Bed group name already exists")

    old_capacity = bed_group.capacity
    bed_group.bedGroup = group_update.bedGroup
    bed_group.capacity = group_update.capacity

    # Increase capacity
    if group_update.capacity > old_capacity:
        start = _next_bed_number()
        for offset in range(group_update.capacity - old_capacity):
            Bed.objects.create(
                bed_number=start + offset,
                bed_group=bed_group,
                is_occupied=False,
            )

    # Decrease capacity
    elif group_update.capacity < old_capacity:
        unoccupied_beds = Bed.objects.filter(bed_group=bed_group, is_occupied=False).order_by("-bed_number")
        to_remove = old_capacity - group_update.capacity
        if unoccupied_beds.count() < to_remove:
            raise HTTPException(status_code=400, detail="Cannot reduce capacity: not enough unoccupied beds")
        for bed in unoccupied_beds[:to_remove]:
            bed.delete()

    bed_group.save()
    bed_group.refresh_counts()
    return BedGroupResponse.from_orm_with_beds(bed_group)


# DELETE BED GROUP
@router.delete("/{group_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_bed_group(group_id: int):
    try:
        bed_group = BedGroup.objects.get(id=group_id)
        if bed_group.occupied > 0:
            raise HTTPException(status_code=400, detail="Cannot delete: group has occupied beds")
        bed_group.beds.all().delete()
        bed_group.delete()
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    return None
