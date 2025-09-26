# fastapi_app/routers/security.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
import jwt
import django
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from HMS_backend.models import Permission

# ------------------ Django setup ------------------
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_backend.settings")
django.setup()

User = get_user_model()

# ------------------ Config ------------------
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ------------------ OAuth2 for Swagger ------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/security/login")

# ------------------ Pydantic Schemas ------------------
class PermissionSchema(BaseModel):
    module: str
    enabled: bool

class UserSchema(BaseModel):
    username: str
    role: str
    permissions: List[PermissionSchema]

# ------------------ Helper Functions ------------------
def create_access_token(data: dict, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + expires_delta})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(username: str, password: str):
    try:
        user = User.objects.get(username=username)
        if check_password(password, user.password):
            return user
    except User.DoesNotExist:
        return None
    return None

def get_permissions_by_role(role: str):
    perms = Permission.objects.filter(role=role)
    return [PermissionSchema(module=p.module, enabled=p.enabled) for p in perms]

# ------------------ Dependencies ------------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
        user = User.objects.get(username=username)
        return {"username": username, "role": role}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ------------------ Router ------------------
router = APIRouter(prefix="/security", tags=["Security"])


# ---------- Create User (Admin only) ----------
@router.post("/create_user")
def create_user(username: str, password: str, role: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can create users")
    
    if User.objects.filter(username=username).exists():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User.objects.create(
        username=username,
        password=make_password(password),
        role=role
    )

    # Optional: Create default permissions for the role
    for module, _ in getattr(Permission, "MODULE_CHOICES", []):
        Permission.objects.get_or_create(role=role, module=module)

    return {"username": user.username, "role": user.role}

# ---------- Get Permissions ----------
@router.get("/permissions/{role}", response_model=List[PermissionSchema])
def read_permissions(role: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin" and current_user["role"] != role:
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_permissions_by_role(role)

# ---------- Toggle Permission (Admin only) ----------
@router.post("/permissions/toggle")
def toggle_permission(role: str, module: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admin can toggle permissions")
    
    try:
        perm = Permission.objects.get(role=role, module=module)
        perm.enabled = not perm.enabled
        perm.save()
        return {"module": perm.module, "enabled": perm.enabled}
    except Permission.DoesNotExist:
        raise HTTPException(status_code=404, detail="Permission not found")
