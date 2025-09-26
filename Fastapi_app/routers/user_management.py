from fastapi import APIRouter, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from HMS_backend.models import Staff, Department  # replace with your actual ORM models

router = APIRouter(prefix="/users", tags=["User Management"])

# --- Response schema ---
class UserOut(BaseModel):
    name: str
    id: str
    email: str
    role: str
    department: str
    joinedOn: str

    class Config:
        orm_mode = True


# --- Endpoint to get dropdown options dynamically ---
@router.get("/filters")
def get_user_filters():
    names = list({s.full_name for s in Staff.objects.all()})
    roles = list({s.designation for s in Staff.objects.all()})
    departments = list({d.name for d in Department.objects.all()})
    return {"names": names, "roles": roles, "departments": departments}


# --- Endpoint to fetch users based on dropdown filters and search ---
@router.get("/", response_model=List[UserOut])
def get_users(
    name: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    qs = Staff.objects.all()

    # Filter by dropdown selections
    if name:
        qs = qs.filter(full_name=name)
    if role:
        qs = qs.filter(designation=role)
    if department:
        qs = qs.filter(department__name=department)

    # Search across multiple fields
    if search:
        qs = qs.filter(
            full_name__icontains=search
        ) | qs.filter(email__icontains=search) \
          | qs.filter(designation__icontains=search) \
          | qs.filter(department__name__icontains=search) \
          | qs.filter(employee_id__icontains=search)

    result = []
    for u in qs:
        result.append(
            UserOut(
                name=u.full_name,
                id=u.employee_id,
                email=u.email or "",
                role=u.designation or "",
                department=u.department.name if u.department else "",
                joinedOn=u.date_of_joining.strftime("%m/%d/%Y") if u.date_of_joining else ""
            )
        )
    return result
