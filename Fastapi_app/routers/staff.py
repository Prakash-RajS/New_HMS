# fastapi_app/routers/staff.py  
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
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
    designation: str
    specialization: Optional[str] = None
    date_of_joining: Optional[str] = None
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

    # Get last staff with same prefix
    last_staff = await run_in_threadpool(
        lambda: Staff.objects.filter(employee_id__startswith=prefix)
        .order_by("-employee_id")
        .first()
    )

    if last_staff and last_staff.employee_id:
        try:
            last_num = int(last_staff.employee_id.replace(prefix, ""))
            new_num = last_num + 1
        except ValueError:
            new_num = 1
    else:
        new_num = 1

    return f"{prefix}{str(new_num).zfill(4)}"


# -----------------------------
# Add Staff
# -----------------------------
@router.post("/add/", response_model=StaffResponse)
async def add_staff(
    full_name: str = Form(...),
    date_of_birth: str = Form(...),
    gender: str = Form(...),
    age: int = Form(...),
    marital_status: str = Form(...),
    address: str = Form(...),
    phone: str = Form(...),
    email: EmailStr = Form(...),
    national_id: str = Form(...),
    city: str = Form(...),
    country: str = Form(...),
    date_of_joining: str = Form(...),
    designation: str = Form(...),
    department_id: int = Form(...),
    specialization: Optional[str] = Form(None),
    status: str = Form(...),
    shift_timing: str = Form(...),
    certificates: List[UploadFile] = File(None),
    profile_picture: Optional[UploadFile] = File(None)
):
    try:
        # Parse dates (expecting MM/DD/YYYY)
        dob = datetime.strptime(date_of_birth, "%m/%d/%Y").date()
        doj = datetime.strptime(date_of_joining, "%m/%d/%Y").date()

        department = await run_in_threadpool(Department.objects.get, id=department_id)

        # Generate unique employee ID
        employee_id = await generate_employee_id(designation)

        # Create staff instance
        staff = await run_in_threadpool(
            Staff.objects.create,
            employee_id=employee_id,
            full_name=full_name,
            date_of_birth=dob,
            gender=gender,
            age=age,
            marital_status=marital_status,
            address=address,
            phone=phone,
            email=email,
            national_id=national_id,
            city=city,
            country=country,
            date_of_joining=doj,
            designation=designation,
            department=department,
            specialization=specialization,
            status=status,
            shift_timing=shift_timing
        )

        # Save multiple certificates
        if certificates:
            os.makedirs("fastapi_app/Staff_documents", exist_ok=True)
            cert_paths = []
            for cert in certificates:
                cert_path = f"fastapi_app/Staff_documents/{staff.id}_{cert.filename}"
                with open(cert_path, "wb") as f:
                    f.write(await cert.read())
                cert_paths.append(cert_path)
            staff.certificates = ",".join(cert_paths)

        # Save profile picture
        if profile_picture:
            os.makedirs("fastapi_app/staffs_pictures", exist_ok=True)
            pic_path = f"fastapi_app/staffs_pictures/{staff.id}_{profile_picture.filename}"
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
            designation=staff.designation,
            specialization=staff.specialization,
            date_of_joining=staff.date_of_joining.isoformat() if staff.date_of_joining else None,
            certificates=staff.certificates,
            profile_picture=staff.profile_picture
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format. Use MM/DD/YYYY. Error: {str(e)}")
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
    try:
        staffs = await run_in_threadpool(
            lambda: list(Staff.objects.select_related("department").all().order_by("id"))
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
                    department=s.department.name if s.department else "N/A",
                    designation=s.designation,
                    specialization=s.specialization,
                    date_of_joining=s.date_of_joining.isoformat() if s.date_of_joining else None,
                    certificates=s.certificates,
                    profile_picture=s.profile_picture
                )
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching staff: {str(e)}")


# -----------------------------
# Update Staff
# -----------------------------
@router.put("/update/{staff_id}/", response_model=StaffResponse)
async def update_staff(
    staff_id: int,
    full_name: Optional[str] = Form(None),
    date_of_birth: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    marital_status: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    email: Optional[EmailStr] = Form(None),
    national_id: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    date_of_joining: Optional[str] = Form(None),
    designation: Optional[str] = Form(None),
    department_id: Optional[int] = Form(None),
    specialization: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    shift_timing: Optional[str] = Form(None),
    certificates: List[UploadFile] = File(None),
    profile_picture: Optional[UploadFile] = File(None),
):
    try:
        staff = await run_in_threadpool(lambda: Staff.objects.select_related("department").get(id=staff_id))

        # Update only provided fields
        if full_name: 
            staff.full_name = full_name
        
        if date_of_birth:
            # Handle multiple date formats
            try:
                if '/' in date_of_birth:
                    staff.date_of_birth = datetime.strptime(date_of_birth, "%m/%d/%Y").date()
                else:
                    staff.date_of_birth = datetime.strptime(date_of_birth, "%Y-%m-%d").date()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use MM/DD/YYYY or YYYY-MM-DD")
        
        if gender: 
            staff.gender = gender
        if age: 
            staff.age = age
        if marital_status: 
            staff.marital_status = marital_status
        if address: 
            staff.address = address
        if phone: 
            staff.phone = phone
        if email: 
            staff.email = email
        if national_id: 
            staff.national_id = national_id
        if city: 
            staff.city = city
        if country: 
            staff.country = country
        
        if date_of_joining:
            # Handle multiple date formats for date_of_joining
            try:
                if '/' in date_of_joining:
                    staff.date_of_joining = datetime.strptime(date_of_joining, "%m/%d/%Y").date()
                else:
                    staff.date_of_joining = datetime.strptime(date_of_joining, "%Y-%m-%d").date()
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use MM/DD/YYYY or YYYY-MM-DD")
        
        if designation: 
            staff.designation = designation
        if department_id:
            department = await run_in_threadpool(Department.objects.get, id=department_id)
            staff.department = department
        if specialization: 
            staff.specialization = specialization
        if status: 
            staff.status = status
        if shift_timing: 
            staff.shift_timing = shift_timing

        # Replace certificates
        if certificates:
            os.makedirs("fastapi_app/Staff_documents", exist_ok=True)
            cert_paths = []
            for cert in certificates:
                cert_path = f"fastapi_app/Staff_documents/{staff.id}_{cert.filename}"
                with open(cert_path, "wb") as f:
                    f.write(await cert.read())
                cert_paths.append(cert_path)
            staff.certificates = ",".join(cert_paths)

        # Replace profile picture
        if profile_picture:
            os.makedirs("fastapi_app/staffs_pictures", exist_ok=True)
            pic_path = f"fastapi_app/staffs_pictures/{staff.id}_{profile_picture.filename}"
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
            department=staff.department.name if staff.department else "",
            designation=staff.designation,
            specialization=staff.specialization,
            date_of_joining=staff.date_of_joining.isoformat() if staff.date_of_joining else None,
            certificates=staff.certificates,
            profile_picture=staff.profile_picture,
        )

    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format. Use MM/DD/YYYY or YYYY-MM-DD. Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# Get Staff by ID
# -----------------------------
@router.get("/{staff_id}/", response_model=StaffResponse)
async def get_staff_by_id(staff_id: int):
    try:
        staff = await run_in_threadpool(lambda: Staff.objects.select_related("department").get(id=staff_id))
        return StaffResponse(
            id=staff.id,
            employee_id=staff.employee_id,
            full_name=staff.full_name,
            email=staff.email,
            phone=staff.phone,
            department=staff.department.name if staff.department else "",
            designation=staff.designation,
            specialization=staff.specialization,
            date_of_joining=staff.date_of_joining.isoformat() if staff.date_of_joining else None,
            certificates=staff.certificates,
            profile_picture=staff.profile_picture
        )
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))