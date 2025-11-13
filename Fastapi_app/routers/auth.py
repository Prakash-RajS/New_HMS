from fastapi import APIRouter, HTTPException, Form, Depends, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from HMS_backend.models import User  
from django.contrib.auth.hashers import check_password
from fastapi.concurrency import run_in_threadpool
import os
import django

# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_backend.settings")
django.setup()

from HMS_backend.models import User

# ==============================
# JWT CONFIGURATION
# ==============================
SECRET_KEY = "super_secret_123"  # same key used across all files
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 scheme to extract token from header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Create router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ==============================
# LOGIN ROUTE
# ==============================
@router.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    """Authenticate user from User table and return JWT token"""
    
    # Validate inputs
    if not username and not password:
        raise HTTPException(status_code=400, detail="Username and password are required")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")

    # Fetch user from User table
    try:
        user = await run_in_threadpool(User.objects.get, username=username)
    except User.DoesNotExist:
        raise HTTPException(status_code=404, detail="Username not found")

    # Check password using Django's hasher
    if not check_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Create JWT token payload
    token_data = {
        "sub": user.username,
        "role": user.role,
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    # Generate token
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
    }


# ==============================
# GET CURRENT USER (Protected)
# ==============================
def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode JWT and return user object"""
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


# ==============================
# PROTECTED ROUTE - TEST TOKEN
# ==============================
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Return current logged-in user details"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
    }
