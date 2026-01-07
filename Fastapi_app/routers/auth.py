# from fastapi import APIRouter, HTTPException, Form, Depends, status
# from fastapi.security import OAuth2PasswordBearer
# from datetime import datetime, timedelta
# from jose import JWTError, jwt
# from HMS_backend.models import User, Permission, Staff
# from django.contrib.auth.hashers import check_password

# import os
# import django

# # Django setup
# # os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_backend.settings")
# # django.setup()

# from HMS_backend.models import User

# # ==============================
# # JWT CONFIGURATION
# # ==============================
# SECRET_KEY = "super_secret_123"  # same key used across all files
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 180

# # OAuth2 scheme to extract token from header
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# # Create router
# router = APIRouter(prefix="/auth", tags=["Authentication"])

# # ==============================
# # HELPER FUNCTIONS
# # ==============================
# def get_user_permissions(role: str):
#     """Get all permissions for a specific role"""
#     permissions = Permission.objects.filter(role=role)
#     return [{"module": p.module, "enabled": p.enabled} for p in permissions]

# def get_staff_details(user):
#     """Get staff details if user is linked to a staff member"""
#     if hasattr(user, 'staff') and user.staff:
#         staff = user.staff
#         return {
#             "full_name": staff.full_name,
#             "designation": staff.designation,
#             "staff_id": staff.employee_id,
#             "department": staff.department.name if staff.department else "N/A",
#             "email": staff.email
#         }
#     return None

# # ==============================
# # LOGIN ROUTE
# # ==============================
# @router.post("/login")
# def login(username: str = Form(...), password: str = Form(...)):
#     close_old_connections()

#     if not username or not password:
#         raise HTTPException(status_code=400, detail="Username and password required")

#     try:
#         user = User.objects.get(username=username)
#     except User.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Username not found")

#     if not check_password(password, user.password):
#         raise HTTPException(status_code=401, detail="Invalid password")

#     permissions = get_user_permissions(user.role)
#     staff_details = get_staff_details(user)

#     token_data = {
#         "sub": user.username,
#         "role": user.role,
#         "permissions": permissions,
#         "user_id": user.id,
#         "is_superuser": user.is_superuser,
#         "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
#     }

#     token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

#     return {
#         "access_token": token,
#         "token_type": "bearer",
#         "user": {
#             "id": user.id,
#             "username": user.username,
#             "role": user.role,
#             "is_superuser": user.is_superuser,
#             "permissions": permissions,
#             "staff_details": staff_details,
#         },
#     }


# # ==============================
# # GET CURRENT USER (Protected)
# # ==============================
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     """Decode JWT and return user object"""
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials or token expired",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: int = payload.get("user_id")
#         username: str = payload.get("sub")

#         if user_id is None or username is None:
#             raise credentials_exception

#         user = User.objects.filter(id=user_id).first()
#         if not user:
#             raise credentials_exception

#         return user

#     except JWTError:
#         raise credentials_exception


# # ==============================
# # PROTECTED ROUTE - GET USER DETAILS WITH PERMISSIONS
# # ==============================
# @router.get("/me")
# def get_me(current_user: User = Depends(get_current_user)):
#     """Return current logged-in user details with permissions"""
#     # Get user permissions
#     permissions = get_user_permissions(current_user.role)
    
#     # Get staff details if available
#     staff_details = get_staff_details(current_user)
    
#     return {
#         "id": current_user.id,
#         "username": current_user.username,
#         "role": current_user.role,
#         "is_superuser": current_user.is_superuser,
#         "permissions": permissions,
#         "staff_details": staff_details
#     }


# # ==============================
# # REFRESH PERMISSIONS ENDPOINT
# # ==============================
# @router.post("/refresh-permissions")
# def refresh_permissions(current_user: User = Depends(get_current_user)):
#     """Refresh and return updated permissions for the current user"""
#     permissions = get_user_permissions(current_user.role)
#     staff_details = get_staff_details(current_user)
    
#     return {
#         "id": current_user.id,
#         "username": current_user.username,
#         "role": current_user.role,
#         "is_superuser": current_user.is_superuser,
#         "permissions": permissions,
#         "staff_details": staff_details
#     }

#Fastapi_app/routers/auth.py
from fastapi import APIRouter, HTTPException, Form, Depends, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt, JWTError
from django.contrib.auth.hashers import check_password
from django.db import close_old_connections
from HMS_backend.models import User, Permission, Staff

# JWT settings
SECRET_KEY = "super_secret_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ----------------- Helper functions -----------------
def get_user_permissions(role: str):
    permissions = Permission.objects.filter(role=role)
    return [{"module": p.module, "enabled": p.enabled} for p in permissions]

def get_staff_details(user):
    if hasattr(user, 'staff') and user.staff:
        staff = user.staff
        return {
            "full_name": staff.full_name,
            "designation": staff.designation,
            "staff_id": staff.employee_id,
            "department": staff.department.name if staff.department else "N/A",
            "email": staff.email
        }
    return None

# ----------------- Login -----------------
@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    # Close old DB connections first
    close_old_connections()

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password required")

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise HTTPException(status_code=404, detail="Username not found")

    if not check_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    permissions = get_user_permissions(user.role)
    staff_details = get_staff_details(user)

    token_data = {
        "sub": user.username,
        "role": user.role,
        "permissions": permissions,
        "user_id": user.id,
        "is_superuser": user.is_superuser,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "is_superuser": user.is_superuser,
            "permissions": permissions,
            "staff_details": staff_details,
        },
    }

# ----------------- Get Current User -----------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        username: str = payload.get("sub")

        if user_id is None or username is None:
            raise credentials_exception

        user = User.objects.filter(id=user_id).first()
        if not user:
            raise credentials_exception

        return user

    except JWTError:
        raise credentials_exception

# ----------------- Protected Routes -----------------
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    permissions = get_user_permissions(current_user.role)
    staff_details = get_staff_details(current_user)
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "is_superuser": current_user.is_superuser,
        "permissions": permissions,
        "staff_details": staff_details
    }

@router.post("/refresh-permissions")
def refresh_permissions(current_user: User = Depends(get_current_user)):
    permissions = get_user_permissions(current_user.role)
    staff_details = get_staff_details(current_user)
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "is_superuser": current_user.is_superuser,
        "permissions": permissions,
        "staff_details": staff_details
    }
