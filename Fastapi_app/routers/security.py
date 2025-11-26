from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List
import os
import django
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError  # ✅ correct imports

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_backend.settings")
django.setup()

from HMS_backend.models import User, Staff, Permission
from django.contrib.auth.hashers import make_password

# ✅ Must match auth.py
SECRET_KEY = "super_secret_123"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ------------------ Schemas ------------------
class StaffSchema(BaseModel):
    full_name: str
    designation: str
    staff_id: str
    department: str
    email: str


class PermissionSchema(BaseModel):
    module: str
    enabled: bool


# ------------------ Helpers ------------------
def get_permissions_by_role(role: str):
    perms = Permission.objects.filter(role=role)
    return [{"module": p.module, "enabled": p.enabled} for p in perms]


def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        username = payload.get("sub")  # ✅ matches auth.py
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token: username missing")

        user = User.objects.get(username=username)
        role = payload.get("role", "staff")

        staff_data = None
        if hasattr(user, "staff") and user.staff:
            s = user.staff
            staff_data = StaffSchema(
                full_name=s.full_name,
                designation=s.designation,
                staff_id=s.employee_id,
                department=s.department.name,
                email=s.email,
            )

        return {
            "username": username,
            "role": role,
            "permissions": get_permissions_by_role(role),
            "staff_details": staff_data,
        }

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid")
    except User.DoesNotExist:
        raise HTTPException(status_code=401, detail="User not found")


# ------------------ Router ------------------
router = APIRouter(prefix="/security", tags=["Security"])

# ---------- Create User ----------
@router.post("/create_user")
def create_user(
    username: str = Form(...),
    password: str = Form(...),
    staff_id: str = Form(...),
    current_user: dict = Depends(get_current_user),
):
    # ✅ Allow Django superuser or role=admin to bypass permission checks
    db_user = User.objects.get(username=current_user["username"])
    if not db_user.is_superuser and current_user["role"] != "admin":
        if "create_user" not in [
            p["module"] for p in current_user["permissions"] if p["enabled"]
        ]:
            raise HTTPException(
                status_code=403, detail="You do not have permission to create users"
            )

    if User.objects.filter(username=username).exists():
        raise HTTPException(status_code=400, detail="Username already exists")

    try:
        staff = Staff.objects.get(employee_id=staff_id)
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff ID not found")

    user = User.objects.create(
        username=username,
        password=make_password(password),
        role=staff.designation,
        staff=staff,
    )

    Permission.initialize_default_permissions()

    # Assign default permissions
    for module, _ in getattr(Permission, "MODULE_CHOICES", []):
        Permission.objects.get_or_create(role=staff.designation, module=module)

    return {
        "message": "User created successfully",
        "username": user.username,
        "role": user.role,
        "staff_id": staff.employee_id,
    }


# ---------- Get Permissions ----------
@router.get("/permissions/{role}", response_model=List[PermissionSchema])
def read_permissions(role: str, current_user: dict = Depends(get_current_user)):
    db_user = User.objects.get(username=current_user["username"])
    # ✅ Allow superuser or admin role bypass
    if not db_user.is_superuser and current_user["role"] != "admin":
        if current_user["role"] != role:
            raise HTTPException(status_code=403, detail="Not authorized")

    return get_permissions_by_role(role)


# ---------- Toggle Permission ----------
@router.post("/permissions/toggle")
def toggle_permission(
    role: str = Form(...),
    module: str = Form(...),
    current_user: dict = Depends(get_current_user),
):
    db_user = User.objects.get(username=current_user["username"])
    # ✅ Allow superuser or admin role bypass
    if not db_user.is_superuser and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can toggle permissions")

    # Validate module exists in MODULE_CHOICES
    valid_modules = [choice[0] for choice in Permission.MODULE_CHOICES]
    if module not in valid_modules:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid module. Must be one of: {', '.join(valid_modules)}"
        )

    try:
        # Use get_or_create to handle both existing and new permissions
        perm, created = Permission.objects.get_or_create(
            role=role,
            module=module,
            defaults={"enabled": False}  # Default to disabled when creating new
        )
        
        # Toggle the enabled status
        perm.enabled = not perm.enabled
        perm.save()
        
        return {"module": perm.module, "enabled": perm.enabled}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error toggling permission: {str(e)}")