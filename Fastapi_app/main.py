# --------------------------------------------------------------
# main.py  (or app.py – the entry point of your FastAPI service)
# --------------------------------------------------------------

# 1. Django must be configured **first**, before any Django models are imported
import fastapi_app.django_setup  # <-- sets DJANGO_SETTINGS_MODULE & calls django.setup()
# --------------------------------------------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# ----------------------------------------------------------------
# Import *all* routers **after** Django is ready
# ----------------------------------------------------------------
from fastapi_app.routers import (
    department, appointments, staff, new_registration, add_bloodgroup,
    blood_donor, labreport, bed_group_list, staffmanagement, payroll,
    attendance, stock, ambulance, billing, auth, security,
    user_management, user_profile, medicine_allocation,
    pharmacybilling, invoice_generator,
)

# ----------------------------------------------------------------
# FastAPI app
# ----------------------------------------------------------------
app = FastAPI(title="HMS Dashboard API")


# ==================== CORS ====================
#   - `allow_origins` contains the exact origin of your Vite dev server.
#   - Using `"*"` is fine for local development; tighten it in prod.
#   - `allow_credentials=True` is required when you send the JWT in a cookie
#     or `Authorization: Bearer …` header.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
        # Add your production frontend URL later, e.g.:
        # "https://yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== STATIC FILES ====================
# Serve uploaded profile pictures at /profile_pictures/<filename>
PROFILE_PIC_DIR = os.path.abspath("profile_pictures")
os.makedirs(PROFILE_PIC_DIR, exist_ok=True)

app.mount(
    "/profile_pictures",
    StaticFiles(directory=PROFILE_PIC_DIR),
    name="profile_pictures",
)
app.mount("/static/patient_photos", StaticFiles(directory="fastapi_app/Patient_photos"), name="patient_photos")

# ==================== HEALTH CHECK ====================
@app.get("/health")
async def health():
    return {"status": "ok", "message": "FastAPI + Django ready"}


# ==================== ROUTERS ====================
app.include_router(department.router)
app.include_router(appointments.router)
app.include_router(staff.router)
app.include_router(new_registration.router)
app.include_router(add_bloodgroup.router)
app.include_router(blood_donor.router)
app.include_router(labreport.router)
app.include_router(bed_group_list.router)
app.include_router(staffmanagement.router)
app.include_router(payroll.router)
app.include_router(attendance.router)
app.include_router(stock.router)
app.include_router(ambulance.router)
app.include_router(billing.router)
app.include_router(auth.router)
app.include_router(security.router)
app.include_router(user_management.router)
app.include_router(user_profile.router)
app.include_router(medicine_allocation.router)
app.include_router(pharmacybilling.router)
app.include_router(invoice_generator.router)