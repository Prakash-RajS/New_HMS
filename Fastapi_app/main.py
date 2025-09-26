# fastapi_app/main.py
import fastapi_app.django_setup  # <-- this sets DJANGO_SETTINGS_MODULE & calls django.setup()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_app.routers import department, appointments, staff,new_registration, add_bloodgroup, blood_donor, labreport, bed_group_list,staffmanagement,payroll,attendance, stock, ambulance, billing,auth
from fastapi_app.routers import security, user_management
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
app.include_router(blood_donor.router)
app.include_router(labreport.router)
app.include_router(bed_group_list.router)
app.include_router(staffmanagement.router)
app.include_router(attendance.router)
app.include_router(payroll.router)
app.include_router(stock.router)
app.include_router(ambulance.router)
app.include_router(billing.router)
app.include_router(auth.router)
app.include_router(security.router)
app.include_router(user_management.router)  
