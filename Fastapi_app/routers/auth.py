
# #Fastapi_app/routers/auth.py
# from fastapi import APIRouter, HTTPException, Form, Depends, status
# from fastapi.security import OAuth2PasswordBearer
# from datetime import datetime, timedelta
# from jose import jwt, JWTError
# from django.contrib.auth.hashers import check_password
# from django.db import close_old_connections
# from HMS_backend.models import User, Permission, Staff

# # JWT settings
# SECRET_KEY = "super_secret_123"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 180

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
# router = APIRouter(prefix="/auth", tags=["Authentication"])

# # ----------------- Helper functions -----------------
# def get_user_permissions(role: str):
#     permissions = Permission.objects.filter(role=role)
#     return [{"module": p.module, "enabled": p.enabled} for p in permissions]

# def get_staff_details(user):
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

# # ----------------- Login -----------------
# @router.post("/login")
# def login(username: str = Form(...), password: str = Form(...)):
#     # Close old DB connections first
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

# # ----------------- Get Current User -----------------
# def get_current_user(token: str = Depends(oauth2_scheme)):
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

# # ----------------- Protected Routes -----------------
# @router.get("/me")
# def get_me(current_user: User = Depends(get_current_user)):
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

# @router.post("/refresh-permissions")
# def refresh_permissions(current_user: User = Depends(get_current_user)):
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
# Fastapi_app/routers/auth.py - COMPLETE FIXED FILE
from fastapi import APIRouter, HTTPException, Form, Depends, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt, JWTError
from django.contrib.auth.hashers import check_password, make_password
from django.db import close_old_connections, connection
from HMS_backend.models import User, Permission, Staff
from pydantic import BaseModel
from typing import Optional

# JWT settings
SECRET_KEY = "super_secret_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ----------------- Models -----------------
class RefreshTokenRequest(BaseModel):
    refresh_token: str

# ----------------- Database Health Check -----------------
def check_db_connection():
    """Ensure database connection is alive"""
    try:
        close_old_connections()
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return True
    except Exception:
        return False

def ensure_db_connection():
    """Reconnect if database connection is lost"""
    if not check_db_connection():
        try:
            connection.close()
            connection.connect()
        except Exception:
            pass

# ----------------- Helper functions -----------------
def get_user_permissions(role: str):
    ensure_db_connection()
    try:
        permissions = Permission.objects.filter(role=role)
        return [{"module": p.module, "enabled": p.enabled} for p in permissions]
    except Exception:
        return []

def get_staff_details(user):
    ensure_db_connection()
    try:
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
    except Exception:
        return None

# ----------------- Token Creation -----------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ----------------- Login -----------------
@router.post("/login")
def login(
    response: Response,
    username: str = Form(...), 
    password: str = Form(...)
):
    ensure_db_connection()
    
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

    # Create tokens
    access_token = create_access_token({
        "sub": user.username,
        "role": user.role,
        "user_id": user.id,
        "is_superuser": user.is_superuser,
    })
    
    refresh_token = create_refresh_token({
        "sub": user.username,
        "user_id": user.id,
    })

    # Set refresh token in HTTP-only cookie (more secure)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,  # Set to True in production
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role,
            "is_superuser": user.is_superuser,
            "permissions": permissions,
            "staff_details": staff_details,
        },
    }

# ----------------- Token Refresh -----------------
@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    try:
        # Get refresh token from cookie
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            # Fallback to body
            body = await request.json()
            refresh_token = body.get("refresh_token")
        
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token required")
        
        # Decode refresh token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user_id = payload.get("user_id")
        username = payload.get("sub")
        
        if not user_id or not username:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        ensure_db_connection()
        user = User.objects.filter(id=user_id, username=username).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Create new access token
        access_token = create_access_token({
            "sub": user.username,
            "role": user.role,
            "user_id": user.id,
            "is_superuser": user.is_superuser,
        })
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token refresh failed: {str(e)}")

# ----------------- Get Current User -----------------
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "access":
            raise credentials_exception
            
        user_id: int = payload.get("user_id")
        username: str = payload.get("sub")

        if user_id is None or username is None:
            raise credentials_exception

        ensure_db_connection()
        user = User.objects.filter(id=user_id, username=username).first()
        if not user:
            raise credentials_exception

        return user

    except JWTError:
        raise credentials_exception

# ----------------- Protected Routes -----------------
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    ensure_db_connection()
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

@router.post("/logout")
def logout(response: Response):
    # Clear the refresh token cookie
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}

# ----------------- Health Check -----------------
@router.get("/health")
def health_check():
    ensure_db_connection()
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected" if check_db_connection() else "disconnected"
    }