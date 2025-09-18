# fastapi_app/main.py
import fastapi_app.django_setup  # <-- this sets DJANGO_SETTINGS_MODULE & calls django.setup()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_app.routers import department, appointments, staff, new_registration, add_bloodgroup

app = FastAPI(title="HMS Dashboard API")

# CORS for your React app (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],  # dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(department.router)
app.include_router(appointments.router)
app.include_router(staff.router)
app.include_router(new_registration.router)
app.include_router(add_bloodgroup.router)

