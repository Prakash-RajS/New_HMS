# fastapi_app/routers/department.py
from fastapi import APIRouter, HTTPException, status
from typing import Optional, Literal, List
from pydantic import BaseModel, Field, ConfigDict
from django.db import transaction, IntegrityError
from HMS_backend.models import Department
from datetime import datetime

router = APIRouter(prefix="/departments", tags=["Departments"])

# ---------- Schemas ----------

# ---------- Schemas ----------
class DepartmentCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    status: str = "active"
    description: Optional[str] = None

    @classmethod
    def validate_status(cls, v: str) -> str:
        if v is None:
            return "active"
        v = v.lower().strip()
        if v not in ["active", "inactive"]:
            raise ValueError("Status must be active or inactive")
        return v

    # This will automatically run validation
    def model_post_init(self, __context):
        self.status = self.validate_status(self.status)


class DepartmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    status: Optional[str] = None
    description: Optional[str] = None

    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v = v.lower().strip()
        if v not in ["active", "inactive"]:
            raise ValueError("Status must be active or inactive")
        return v

    def model_post_init(self, __context):
        if self.status is not None:
            self.status = self.validate_status(self.status)

class DepartmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    status: str
    description: Optional[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# ---------- Routes ----------

@router.post("/create", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(payload: DepartmentCreate):
    """
    Create a Department.
    """
    if Department.objects.filter(name__iexact=payload.name).exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Department with this name already exists.",
        )

    try:
        with transaction.atomic():
            dep = Department.objects.create(
                name=payload.name.strip(),
                status=payload.status,
                description=payload.description,
            )
            return DepartmentOut.model_validate(dep)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Department with this name already exists.",
        )


@router.get("/", response_model=List[DepartmentOut])
def list_departments():
    """
    Fetch all departments.
    """
    deps = Department.objects.all().order_by("id")
    return [DepartmentOut.model_validate(dep) for dep in deps]


@router.put("/{department_id}", response_model=DepartmentOut)
def update_department(department_id: int, payload: DepartmentUpdate):
    """
    Update department by ID.
    """
    try:
        dep = Department.objects.get(id=department_id)
    except Department.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found.",
        )

    if payload.name and Department.objects.filter(name__iexact=payload.name).exclude(id=department_id).exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Department with this name already exists.",
        )

    # Apply updates
    if payload.name is not None:
        dep.name = payload.name.strip()
    if payload.status is not None:
        dep.status = payload.status
    if payload.description is not None:
        dep.description = payload.description

    dep.save()
    return DepartmentOut.model_validate(dep)
