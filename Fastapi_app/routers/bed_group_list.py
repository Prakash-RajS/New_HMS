from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict
from typing import List
from HMS_backend.models import BedGroup, Bed   # Django models

router = APIRouter(prefix="/bedgroups", tags=["Bed Groups"])

# ---------------------------
# Pydantic Schemas
# ---------------------------

class BedGroupBase(BaseModel):
    bedGroup: str
    capacity: int


class BedGroupCreate(BedGroupBase):
    pass


class BedBase(BaseModel):
    bed_number: int
    is_occupied: bool


class BedResponse(BedBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class BedGroupResponse(BedGroupBase):
    id: int
    occupied: int
    unoccupied: int
    status: str
    beds: List[BedResponse] = []

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_with_beds(cls, group: BedGroup):
        """Convert Django BedGroup + related beds into Pydantic response"""
        return cls(
            id=group.id,
            bedGroup=group.bedGroup,
            capacity=group.capacity,
            occupied=group.occupied,
            unoccupied=group.unoccupied,
            status=group.status,
            beds=[BedResponse.from_orm(bed) for bed in group.beds.all()]
        )


# ---------------------------
# Routes
# ---------------------------

# Create Bed Group + auto-generate beds
@router.post("/", response_model=BedGroupResponse)
def create_bed_group(group: BedGroupCreate):
    if BedGroup.objects.filter(bedGroup=group.bedGroup).exists():
        raise HTTPException(status_code=400, detail="Bed group already exists")
    
    new_group = BedGroup.objects.create(
        bedGroup=group.bedGroup,
        capacity=group.capacity,
        occupied=0,
        unoccupied=group.capacity,
        status="Available",
    )

    # Auto-create beds
    for i in range(1, group.capacity + 1):
        Bed.objects.create(bed_number=i, bed_group=new_group)

    return BedGroupResponse.from_orm_with_beds(new_group)


# Get all Bed Groups
@router.get("/", response_model=List[BedGroupResponse])
def get_bed_groups():
    groups = BedGroup.objects.all()
    return [BedGroupResponse.from_orm_with_beds(g) for g in groups]


# Get Beds of a Group
@router.get("/{group_id}/beds", response_model=BedGroupResponse)
def get_beds(group_id: int):
    try:
        group = BedGroup.objects.get(id=group_id)
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")

    return BedGroupResponse.from_orm_with_beds(group)


# Allocate a Bed
@router.post("/{group_id}/beds/{bed_number}/allocate", response_model=BedGroupResponse)
def allocate_bed(group_id: int, bed_number: int):
    try:
        group = BedGroup.objects.get(id=group_id)
        bed = Bed.objects.get(bed_group=group, bed_number=bed_number)
    except (BedGroup.DoesNotExist, Bed.DoesNotExist):
        raise HTTPException(status_code=404, detail="Bed or Bed group not found")

    if bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed already occupied")

    bed.is_occupied = True
    bed.save()

    group.occupied += 1
    group.unoccupied -= 1
    group.update_status()

    return BedGroupResponse.from_orm_with_beds(group)


# Vacate a Bed
@router.post("/{group_id}/beds/{bed_number}/vacate", response_model=BedGroupResponse)
def vacate_bed(group_id: int, bed_number: int):
    try:
        group = BedGroup.objects.get(id=group_id)
        bed = Bed.objects.get(bed_group=group, bed_number=bed_number)
    except (BedGroup.DoesNotExist, Bed.DoesNotExist):
        raise HTTPException(status_code=404, detail="Bed or Bed group not found")

    if not bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already vacant")

    bed.is_occupied = False
    bed.save()

    group.occupied -= 1
    group.unoccupied += 1
    group.update_status()

    return BedGroupResponse.from_orm_with_beds(group)
