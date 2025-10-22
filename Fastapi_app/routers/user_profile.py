from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from django.db import IntegrityError
from HMS_backend.models import Staff, Department
from starlette.concurrency import run_in_threadpool
import os
import bcrypt

router = APIRouter(prefix="/profile", tags=["User_Profile"])

# ---------- Pydantic Schemas ----------
class ProfileResponse(BaseModel):
    id: int  # Changed to id to match Staff model's primary key
    employee_id: str  # Still included for display purposes
    full_name: str
    email: EmailStr
    phone: str
    designation: str
    department: str
    date_of_joining: date
    address: str
    city: str
    country: str
    timezone: Optional[str] = None
    profile_picture: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    department_id: Optional[int] = None
    date_of_joining: Optional[date] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None

class PasswordChange(BaseModel):
    new_password: str
    confirm_password: str

# ---------- Fetch Profile by Staff ID ----------
@router.get("/{staff_id}/", response_model=ProfileResponse)
async def get_profile(staff_id: int):  # Changed to int to match Staff.id
    try:
        profile = await run_in_threadpool(
            lambda: Staff.objects.select_related("department").get(id=staff_id)
        )
        return ProfileResponse(
            id=profile.id,
            employee_id=profile.employee_id,
            full_name=profile.full_name,
            email=profile.email,
            phone=profile.phone,
            designation=profile.designation,
            department=profile.department.name if profile.department else "",
            date_of_joining=profile.date_of_joining,
            address=profile.address,
            city=profile.city,
            country=profile.country,
            timezone=profile.timezone if hasattr(profile, 'timezone') else None,
            profile_picture=profile.profile_picture
        )
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Update Profile ----------
@router.put("/update/{staff_id}/", response_model=ProfileResponse)
async def update_profile(
    staff_id: int,  # Changed to int to match Staff.id
    full_name: Optional[str] = Form(None),
    email: Optional[EmailStr] = Form(None),
    phone: Optional[str] = Form(None),
    designation: Optional[str] = Form(None),
    department_id: Optional[int] = Form(None),
    date_of_joining: Optional[date] = Form(None),
    address: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    timezone: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None)
):
    try:
        profile = await run_in_threadpool(Staff.objects.get, id=staff_id)

        if department_id:
            department = await run_in_threadpool(Department.objects.get, id=department_id)
            profile.department = department

        # Update profile picture if provided
        if profile_picture:
            os.makedirs("fastapi_app/profile_pictures", exist_ok=True)
            pic_path = f"fastapi_app/profile_pictures/{profile_picture.filename}"
            with open(pic_path, "wb") as f:
                f.write(await profile_picture.read())
            profile.profile_picture = pic_path

        # Update other fields dynamically
        for field, value in {
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "designation": designation,
            "date_of_joining": date_of_joining,
            "address": address,
            "city": city,
            "country": country,
            "timezone": timezone
        }.items():
            if value is not None:
                setattr(profile, field, value)

        await run_in_threadpool(profile.save)

        return ProfileResponse(
            id=profile.id,
            employee_id=profile.employee_id,
            full_name=profile.full_name,
            email=profile.email,
            phone=profile.phone,
            designation=profile.designation,
            department=profile.department.name if profile.department else "",
            date_of_joining=profile.date_of_joining,
            address=profile.address,
            city=profile.city,
            country=profile.country,
            timezone=profile.timezone if hasattr(profile, 'timezone') else None,
            profile_picture=profile.profile_picture
        )
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Profile not found")
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Profile with this email or phone already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Change Password ----------
@router.post("/change-password/{staff_id}/")
async def change_password(staff_id: int, password_data: PasswordChange):  # Changed to int to match Staff.id
    try:
        if password_data.new_password != password_data.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")
        
        if len(password_data.new_password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

        profile = await run_in_threadpool(Staff.objects.get, id=staff_id)
        
        # Hash the new password
        hashed_password = bcrypt.hashpw(password_data.new_password.encode('utf-8'), bcrypt.gensalt())
        profile.password = hashed_password.decode('utf-8')
        
        await run_in_threadpool(profile.save)
        
        return {"message": "Password changed successfully"}
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Profile not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))