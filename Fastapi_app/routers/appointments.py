# from fastapi import APIRouter, HTTPException, status
# from typing import List, Optional, Literal
# from pydantic import BaseModel, Field, ConfigDict
# from django.db import transaction
# from HMS_backend.models import Appointment, Department, Doctor
# from datetime import datetime

# router = APIRouter(prefix="/appointments", tags=["Appointments"])

# # ---------- Schemas ----------

# class AppointmentCreate(BaseModel):
#     patient_name: str = Field(..., min_length=1, max_length=200)
#     department_id: int
#     doctor_id: int
#     room_no: str
#     phone_no: str
#     appointment_type: Literal["checkup", "followup", "emergency"]
#     status: Literal["new", "normal", "severe"] = "new"


# class AppointmentUpdate(BaseModel):
#     patient_name: Optional[str] = None
#     department_id: Optional[int] = None
#     doctor_id: Optional[int] = None
#     room_no: Optional[str] = None
#     phone_no: Optional[str] = None
#     appointment_type: Optional[Literal["checkup", "followup", "emergency"]] = None
#     status: Optional[Literal["new", "normal", "severe"]] = None


# class AppointmentOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)
#     id: int
#     patient_name: str
#     patient_id: str
#     department: str
#     doctor: str
#     room_no: str
#     phone_no: str
#     appointment_type: str
#     status: str
#     created_at: datetime
#     updated_at: datetime


# # ---------- Routes ----------

# @router.post("/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
# def create_appointment(payload: AppointmentCreate):
#     try:
#         department = Department.objects.get(id=payload.department_id)
#         doctor = Doctor.objects.get(id=payload.doctor_id)
#     except (Department.DoesNotExist, Doctor.DoesNotExist):
#         raise HTTPException(status_code=404, detail="Department or Doctor not found")

#     with transaction.atomic():
#         appointment = Appointment.objects.create(
#             patient_name=payload.patient_name,
#             department=department,
#             doctor=doctor,
#             room_no=payload.room_no,
#             phone_no=payload.phone_no,
#             appointment_type=payload.appointment_type,
#             status=payload.status,
#         )
#         return AppointmentOut.model_validate({
#             "id": appointment.id,
#             "patient_name": appointment.patient_name,
#             "patient_id": appointment.patient_id,
#             "department": appointment.department.name,
#             "doctor": appointment.doctor.name,   # assuming Doctor has "name"
#             "room_no": appointment.room_no,
#             "phone_no": appointment.phone_no,
#             "appointment_type": appointment.appointment_type,
#             "status": appointment.status,
#             "created_at": appointment.created_at,
#             "updated_at": appointment.updated_at,
#         })


# @router.get("/", response_model=List[AppointmentOut])
# def list_appointments():
#     appointments = Appointment.objects.all().order_by("-created_at")
#     return [
#         AppointmentOut.model_validate({
#             "id": appt.id,
#             "patient_name": appt.patient_name,
#             "patient_id": appt.patient_id,
#             "department": appt.department.name,
#             "doctor": appt.doctor.name,
#             "room_no": appt.room_no,
#             "phone_no": appt.phone_no,
#             "appointment_type": appt.appointment_type,
#             "status": appt.status,
#             "created_at": appt.created_at,
#             "updated_at": appt.updated_at,
#         }) for appt in appointments
#     ]


# @router.put("/{appointment_id}", response_model=AppointmentOut)
# def update_appointment(appointment_id: int, payload: AppointmentUpdate):
#     try:
#         appt = Appointment.objects.get(id=appointment_id)
#     except Appointment.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Appointment not found")

#     if payload.patient_name is not None:
#         appt.patient_name = payload.patient_name
#     if payload.department_id is not None:
#         try:
#             appt.department = Department.objects.get(id=payload.department_id)
#         except Department.DoesNotExist:
#             raise HTTPException(status_code=404, detail="Department not found")
#     if payload.doctor_id is not None:
#         try:
#             appt.doctor = Doctor.objects.get(id=payload.doctor_id)
#         except Doctor.DoesNotExist:
#             raise HTTPException(status_code=404, detail="Doctor not found")
#     if payload.room_no is not None:
#         appt.room_no = payload.room_no
#     if payload.phone_no is not None:
#         appt.phone_no = payload.phone_no
#     if payload.appointment_type is not None:
#         appt.appointment_type = payload.appointment_type
#     if payload.status is not None:
#         appt.status = payload.status

#     appt.save()

#     return AppointmentOut.model_validate({
#         "id": appt.id,
#         "patient_name": appt.patient_name,
#         "patient_id": appt.patient_id,
#         "department": appt.department.name,
#         "doctor": appt.doctor.name,
#         "room_no": appt.room_no,
#         "phone_no": appt.phone_no,
#         "appointment_type": appt.appointment_type,
#         "status": appt.status,
#         "created_at": appt.created_at,
#         "updated_at": appt.updated_at,
#     })


from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict
from django.db import transaction
from HMS_backend.models import Appointment, Department
from datetime import datetime

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# ---------- Schemas ----------

class AppointmentCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=200)
    department_id: int
    doctor: str   # <-- plain string
    room_no: str
    phone_no: str
    appointment_type: Literal["checkup", "followup", "emergency"]
    status: Literal["new", "normal", "severe"] = "new"


class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    department_id: Optional[int] = None
    doctor: Optional[str] = None
    room_no: Optional[str] = None
    phone_no: Optional[str] = None
    appointment_type: Optional[Literal["checkup", "followup", "emergency"]] = None
    status: Optional[Literal["new", "normal", "severe"]] = None


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    patient_name: str
    patient_id: str
    department: str
    doctor: str
    room_no: str
    phone_no: str
    appointment_type: str
    status: str
    created_at: datetime
    updated_at: datetime


# ---------- Routes ----------

@router.post("/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate):
    try:
        department = Department.objects.get(id=payload.department_id)
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")

    with transaction.atomic():
        appointment = Appointment.objects.create(
            patient_name=payload.patient_name,
            department=department,
            doctor=payload.doctor,   # <-- string directly
            room_no=payload.room_no,
            phone_no=payload.phone_no,
            appointment_type=payload.appointment_type,
            status=payload.status,
        )
        return AppointmentOut.model_validate({
            "id": appointment.id,
            "patient_name": appointment.patient_name,
            "patient_id": appointment.patient_id,
            "department": appointment.department.name,
            "doctor": appointment.doctor,   # <-- plain string
            "room_no": appointment.room_no,
            "phone_no": appointment.phone_no,
            "appointment_type": appointment.appointment_type,
            "status": appointment.status,
            "created_at": appointment.created_at,
            "updated_at": appointment.updated_at,
        })


@router.get("/", response_model=List[AppointmentOut])
def list_appointments():
    appointments = Appointment.objects.all().order_by("-created_at")
    return [
        AppointmentOut.model_validate({
            "id": appt.id,
            "patient_name": appt.patient_name,
            "patient_id": appt.patient_id,
            "department": appt.department.name,
            "doctor": appt.doctor,   # <-- string
            "room_no": appt.room_no,
            "phone_no": appt.phone_no,
            "appointment_type": appt.appointment_type,
            "status": appt.status,
            "created_at": appt.created_at,
            "updated_at": appt.updated_at,
        }) for appt in appointments
    ]


@router.put("/{appointment_id}", response_model=AppointmentOut)
def update_appointment(appointment_id: int, payload: AppointmentUpdate):
    try:
        appt = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if payload.patient_name is not None:
        appt.patient_name = payload.patient_name
    if payload.department_id is not None:
        try:
            appt.department = Department.objects.get(id=payload.department_id)
        except Department.DoesNotExist:
            raise HTTPException(status_code=404, detail="Department not found")
    if payload.doctor is not None:   # <-- changed from doctor_id to doctor
        appt.doctor = payload.doctor
    if payload.room_no is not None:
        appt.room_no = payload.room_no
    if payload.phone_no is not None:
        appt.phone_no = payload.phone_no
    if payload.appointment_type is not None:
        appt.appointment_type = payload.appointment_type
    if payload.status is not None:
        appt.status = payload.status

    appt.save()

    return AppointmentOut.model_validate({
        "id": appt.id,
        "patient_name": appt.patient_name,
        "patient_id": appt.patient_id,
        "department": appt.department.name,
        "doctor": appt.doctor,   # <-- plain string
        "room_no": appt.room_no,
        "phone_no": appt.phone_no,
        "appointment_type": appt.appointment_type,
        "status": appt.status,
        "created_at": appt.created_at,
        "updated_at": appt.updated_at,
    })
