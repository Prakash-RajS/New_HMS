from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, status, Body
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import date
from django.db import IntegrityError
from HMS_backend.models import Staff, Department, User
from asgiref.sync import sync_to_async
from django.contrib.auth.hashers import make_password
from jose import JWTError, jwt
import os

# ------------------- Router -------------------
router = APIRouter(prefix="/api/profile", tags=["User_Profile"])

# ------------------- JWT Settings -------------------
SECRET_KEY = "super_secret_123"  # Make sure this matches your auth endpoint
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ------------------- Async Database Operations -------------------
@sync_to_async
def get_user_by_id(user_id):
    try:
        return User.objects.select_related("staff").get(id=user_id)
    except User.DoesNotExist:
        return None

@sync_to_async
def get_staff_with_department(staff_id):
    try:
        return Staff.objects.select_related("department").get(id=staff_id)
    except Staff.DoesNotExist:
        return None

@sync_to_async
def get_staff_with_user(staff_id):
    try:
        return Staff.objects.select_related("user").get(id=staff_id)
    except Staff.DoesNotExist:
        return None

@sync_to_async
def save_staff(staff):
    staff.save()

@sync_to_async
def save_user(user):
    user.save()

@sync_to_async
def update_staff_fields(staff, **fields):
    for field, value in fields.items():
        if value is not None:
            setattr(staff, field, value)
    staff.save()
    return staff

# ------------------- JWT Dependency -------------------
async def get_current_staff(token: str = Depends(oauth2_scheme)):
    try:
        print(f"Received token: {token[:50]}...")  # Debug log
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        
        print(f"Decoded payload - user_id: {user_id}")  # Debug log
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token: No user_id found"
            )

        # Get user and their associated staff using async function
        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User not found"
            )

        if not user.staff:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Staff profile not found for this user"
            )

        print(f"Found staff: {user.staff.full_name}")  # Debug log
        return user.staff

    except JWTError as e:
        print(f"JWT Error: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=f"Invalid or expired token: {str(e)}"
        )
    except Exception as e:
        print(f"Unexpected error in get_current_staff: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=f"Authentication failed: {str(e)}"
        )

# ------------------- Pydantic Schemas -------------------
class ProfileResponse(BaseModel):
    id: int
    employee_id: Optional[str] = ""
    full_name: str
    email: EmailStr
    phone: str
    designation: str
    department: str

    date_of_joining: Optional[date] = None
    address: Optional[str] = ""
    city: Optional[str] = ""
    country: Optional[str] = ""

    timezone: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    new_password: str
    confirm_password: str

    @validator('new_password')
    def validate_password_length(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

# ==================== /me/ ENDPOINTS ====================

@router.get("/me/", response_model=ProfileResponse)
async def get_my_profile(staff: Staff = Depends(get_current_staff)):
    try:
        print(f"Fetching profile for staff ID: {staff.id}")  # Debug log
        
        # Ensure we have the latest data with department using async function
        staff_with_dept = await get_staff_with_department(staff.id)
        if not staff_with_dept:
            raise HTTPException(status_code=404, detail="Staff profile not found")
        
        response_data = ProfileResponse(
            id=staff_with_dept.id,
            employee_id=staff_with_dept.employee_id or "",
            full_name=staff_with_dept.full_name,
            email=staff_with_dept.email,
            phone=staff_with_dept.phone,
            designation=staff_with_dept.designation,
            department=staff_with_dept.department.name if staff_with_dept.department else "",
            date_of_joining=staff_with_dept.date_of_joining,
            address=staff_with_dept.address,
            city=staff_with_dept.city,
            country=staff_with_dept.country,
            timezone=getattr(staff_with_dept, 'timezone', None),
            profile_picture=staff_with_dept.profile_picture
        )
        
        print(f"Profile data prepared for: {staff_with_dept.full_name}")  # Debug log
        return response_data
        
    except Exception as e:
        print(f"Error in get_my_profile: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")


@router.put("/update/me/", response_model=ProfileResponse)
async def update_my_profile(
    staff: Staff = Depends(get_current_staff),
    full_name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    designation: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    timezone: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None)
):
    try:
        print(f"Updating profile for staff ID: {staff.id}")  # Debug log
        
        # Get fresh staff instance for update
        current_staff = await get_staff_with_department(staff.id)
        if not current_staff:
            raise HTTPException(status_code=404, detail="Staff profile not found")

        if profile_picture:
            os.makedirs("profile_pictures", exist_ok=True)
            pic_path = f"profile_pictures/{profile_picture.filename}"
            with open(pic_path, "wb") as f:
                content = await profile_picture.read()
                f.write(content)
            current_staff.profile_picture = pic_path

        # Update fields using async function
        updated_staff = await update_staff_fields(
            current_staff,
            full_name=full_name,
            email=email,
            phone=phone,
            designation=designation,
            address=address,
            city=city,
            country=country,
            timezone=timezone
        )

        # Get updated staff with department
        final_staff = await get_staff_with_department(updated_staff.id)

        return ProfileResponse(
            id=final_staff.id,
            employee_id=final_staff.employee_id or "",
            full_name=final_staff.full_name,
            email=final_staff.email,
            phone=final_staff.phone,
            designation=final_staff.designation,
            department=final_staff.department.name if final_staff.department else "",
            date_of_joining=final_staff.date_of_joining,
            address=final_staff.address,
            city=final_staff.city,
            country=final_staff.country,
            timezone=getattr(final_staff, 'timezone', None),
            profile_picture=final_staff.profile_picture
        )
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Email or phone already exists")
    except Exception as e:
        print(f"Error in update_my_profile: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/change-password/me/")
async def change_my_password(
    password_data: PasswordChange,
    staff: Staff = Depends(get_current_staff)
):
    try:
        print(f"Changing password for staff ID: {staff.id}")  # Debug log
        
        if password_data.new_password != password_data.confirm_password:
            raise HTTPException(status_code=400, detail="Passwords do not match")

        # Get fresh staff instance with user relation using async function
        current_staff = await get_staff_with_user(staff.id)
        if not current_staff:
            raise HTTPException(status_code=404, detail="Staff profile not found")
        
        if not current_staff.user:
            raise HTTPException(status_code=400, detail="No user account linked")

        # Update password using async function
        current_staff.user.password = make_password(password_data.new_password)
        await save_user(current_staff.user)

        return {"message": "Password updated successfully"}
    except Exception as e:
        print(f"Error in change_my_password: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))


# ==================== DEBUG ENDPOINT ====================

@router.get("/debug/token")
async def debug_token(token: str = Depends(oauth2_scheme)):
    """Debug endpoint to check token validity"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        
        user = await get_user_by_id(user_id)
        if not user:
            return {
                "token_valid": False,
                "error": "User not found"
            }
            
        staff_info = None
        if user.staff:
            staff_info = {
                "id": user.staff.id,
                "full_name": user.staff.full_name,
                "email": user.staff.email
            }
            
        return {
            "token_valid": True,
            "user_id": user_id,
            "username": user.username,
            "staff": staff_info
        }
    except Exception as e:
        return {
            "token_valid": False,
            "error": str(e)
        }


# ==================== FALLBACK SYNC ENDPOINTS ====================

@router.get("/sync/me/", response_model=ProfileResponse)
async def get_my_profile_sync(staff: Staff = Depends(get_current_staff)):
    """
    Fallback endpoint using sync_to_async wrapper for the entire function
    """
    @sync_to_async
    def get_profile_sync(staff_id):
        try:
            staff_with_dept = Staff.objects.select_related("department").get(id=staff_id)
            return ProfileResponse(
                id=staff_with_dept.id,
                employee_id=staff_with_dept.employee_id or "",
                full_name=staff_with_dept.full_name,
                email=staff_with_dept.email,
                phone=staff_with_dept.phone,
                designation=staff_with_dept.designation,
                department=staff_with_dept.department.name if staff_with_dept.department else "",
                date_of_joining=staff_with_dept.date_of_joining,
                address=staff_with_dept.address,
                city=staff_with_dept.city,
                country=staff_with_dept.country,
                timezone=getattr(staff_with_dept, 'timezone', None),
                profile_picture=staff_with_dept.profile_picture
            )
        except Staff.DoesNotExist:
            raise HTTPException(status_code=404, detail="Staff profile not found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")
    
    return await get_profile_sync(staff.id)