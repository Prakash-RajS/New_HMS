from fastapi import APIRouter, HTTPException, Form
from datetime import datetime, timedelta
import jwt
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_backend.settings")
django.setup()

from HMS_backend.models import User

# ✅ Use same key everywhere
SECRET_KEY = "super_secret_123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.check_password(password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # ✅ standardized claims
    token_data = {
        "sub": user.username,  # subject claim
        "role": user.role,
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    }

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role,
    }
