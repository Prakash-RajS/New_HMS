# fastapi_app/routers/auth.py
from fastapi import APIRouter, HTTPException, Form
from datetime import datetime, timedelta
import jwt
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_backend.settings")
django.setup()

from HMS_backend.models import User

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    try:
        user = User.objects.get(username=username, role="admin")
    except User.DoesNotExist:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.check_password(password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generate JWT
    token_data = {
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    # Return token + user info
    return {
        "message": "Login successful",
        "token": token,
        "user_id": user.id,
        "role": user.role
    }

