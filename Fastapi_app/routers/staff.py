# fastapi_app/routers/staff.py

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from django.db import IntegrityError
from HMS_backend.models import Staff, Department
from starlette.concurrency import run_in_threadpool
import os

router = APIRouter(prefix="/staff", tags=["Staffs"])

# ---------- Pydantic Schemas ----------
class StaffResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    phone: str
    department: str
    certificates: Optional[str] = None
    profile_picture: Optional[str] = None


# ---------- Helper for Employee ID ----------
async def generate_employee_id(designation: str) -> str:
    prefix_map = {
        "doctor": "DOC",
        "nurse": "NUR",
        "staff": "STA"
    }

    prefix = prefix_map.get(designation.lower(), "STA")

    # Count existing employees with this prefix
    last_staff = await run_in_threadpool(
        lambda: Staff.objects.filter(employee_id__startswith=prefix)
        .order_by("-employee_id")
        .first()
    )

    if last_staff and last_staff.employee_id:
        last_num = int(last_staff.employee_id.replace(prefix, ""))
        new_num = last_num + 1
    else:
        new_num = 1

    return f"{prefix}{str(new_num).zfill(4)}"


# -----------------------------
# Add Staff
# -----------------------------
@router.post("/add/", response_model=StaffResponse)
async def add_staff(
    full_name: str = Form(...),
    date_of_birth: date = Form(...),
    gender: str = Form(...),
    age: int = Form(...),
    marital_status: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    email: EmailStr = Form(...),
    national_id: str = Form(...),
    city: str = Form(...),
    country: str = Form(...),
    date_of_joining: date = Form(...),
    designation: str = Form(...),
    department_id: int = Form(...),
    specialization: Optional[str] = Form(None),
    status: str = Form(...),
    shift_timing: str = Form(...),
    certificates: Optional[UploadFile] = File(None),
    profile_picture: Optional[UploadFile] = File(None)
):
    try:
        department = await run_in_threadpool(Department.objects.get, id=department_id)

        # Generate employee ID
        employee_id = await generate_employee_id(designation)

        # Create staff without files first
        staff = await run_in_threadpool(
            Staff.objects.create,
            employee_id=employee_id,
            full_name=full_name,
            date_of_birth=date_of_birth,
            gender=gender,
            age=age,
            marital_status=marital_status,
            address=address,
            phone=phone,
            email=email,
            national_id=national_id,
            city=city,
            country=country,
            date_of_joining=date_of_joining,
            designation=designation,
            department=department,
            specialization=specialization,
            status=status,
            shift_timing=shift_timing
        )

        # Save certificate if provided
        if certificates:
            os.makedirs("fastapi_app/Staff_documents", exist_ok=True)
            certificate_path = f"fastapi_app/Staff_documents/{certificates.filename}"
            with open(certificate_path, "wb") as f:
                f.write(await certificates.read())
            staff.certificates = certificate_path

        # Save profile picture if provided
        if profile_picture:
            os.makedirs("fastapi_app/staffs_pictures", exist_ok=True)
            pic_path = f"fastapi_app/staffs_pictures/{profile_picture.filename}"
            with open(pic_path, "wb") as f:
                f.write(await profile_picture.read())
            staff.profile_picture = pic_path

        await run_in_threadpool(staff.save)

        return StaffResponse(
            id=staff.id,
            employee_id=staff.employee_id,
            full_name=staff.full_name,
            email=staff.email,
            phone=staff.phone,
            department=staff.department.name,
            certificates=staff.certificates,
            profile_picture=staff.profile_picture
        )

    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Staff with this email or ID already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# Fetch All Staff
# -----------------------------
@router.get("/all/", response_model=List[StaffResponse])
async def get_all_staff():
    staffs = await run_in_threadpool(
        lambda: list(Staff.objects.select_related("department").all())
    )
    result = []
    for s in staffs:
        result.append(
            StaffResponse(
                id=s.id,
                employee_id=s.employee_id,
                full_name=s.full_name,
                email=s.email,
                phone=s.phone,
                department=s.department.name if s.department else "",
                certificates=s.certificates,
                profile_picture=s.profile_picture
            )
        )
    return result

# -----------------------------
# Update Staff
# -----------------------------
@router.put("/update/{staff_id}/", response_model=StaffResponse)
async def update_staff(
    staff_id: int,
    full_name: Optional[str] = Form(None),
    date_of_birth: Optional[date] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    marital_status: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    email: Optional[EmailStr] = Form(None),
    national_id: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    date_of_joining: Optional[date] = Form(None),
    designation: Optional[str] = Form(None),
    department_id: Optional[int] = Form(None),
    specialization: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    shift_timing: Optional[str] = Form(None),
    certificates: Optional[UploadFile] = File(None),
    profile_picture: Optional[UploadFile] = File(None)
):
    try:
        staff = await run_in_threadpool(Staff.objects.get, id=staff_id)

        if department_id:
            department = await run_in_threadpool(Department.objects.get, id=department_id)
            staff.department = department

        # Update certificates if provided
        if certificates:
            os.makedirs("fastapi_app/Staff_documents", exist_ok=True)
            certificate_path = f"fastapi_app/Staff_documents/{certificates.filename}"
            with open(certificate_path, "wb") as f:
                f.write(await certificates.read())
            staff.certificates = certificate_path

        # Update profile picture if provided
        if profile_picture:
            os.makedirs("fastapi_app/staffs_pictures", exist_ok=True)
            pic_path = f"fastapi_app/staffs_pictures/{profile_picture.filename}"
            with open(pic_path, "wb") as f:
                f.write(await profile_picture.read())
            staff.profile_picture = pic_path

        # Update other fields dynamically
        for field, value in {
            "full_name": full_name,
            "date_of_birth": date_of_birth,
            "gender": gender,
            "age": age,
            "marital_status": marital_status,
            "address": address,
            "phone": phone,
            "email": email,
            "national_id": national_id,
            "city": city,
            "country": country,
            "date_of_joining": date_of_joining,
            "designation": designation,
            "specialization": specialization,
            "status": status,
            "shift_timing": shift_timing,
        }.items():
            if value is not None:
                setattr(staff, field, value)

        await run_in_threadpool(staff.save)

        return StaffResponse(
            id=staff.id,
            employee_id=staff.employee_id,
            full_name=staff.full_name,
            email=staff.email,
            phone=staff.phone,
            department=staff.department.name,
            certificates=staff.certificates,
            profile_picture=staff.profile_picture
        )

    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Staff with this email or ID already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





