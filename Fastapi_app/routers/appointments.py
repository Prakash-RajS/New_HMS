from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Literal
from pydantic import BaseModel
from datetime import datetime
from django.db import transaction
from HMS_backend.models import Appointment, Department, Staff
from starlette.concurrency import run_in_threadpool
from asgiref.sync import sync_to_async

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# ---------- Schemas ----------
class AppointmentCreate(BaseModel):
    patient_name: str
    department_id: int
    staff_id: int
    room_no: str
    phone_no: str
    appointment_type: Literal["checkup", "followup", "emergency"]
    status: Literal["new", "normal", "severe"] = "new"

class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    department_id: Optional[int] = None
    staff_id: Optional[int] = None
    room_no: Optional[str] = None
    phone_no: Optional[str] = None
    appointment_type: Optional[Literal["checkup", "followup", "emergency"]] = None
    status: Optional[Literal["new", "normal", "severe"]] = None

class AppointmentOut(BaseModel):
    id: int
    patient_name: str
    patient_id: str
    department: str
    staff: str
    room_no: str
    phone_no: str
    appointment_type: str
    status: str
    created_at: datetime
    updated_at: datetime

# ---------- Helper ----------
def appointment_to_out(appt: Appointment) -> AppointmentOut:
    return AppointmentOut(
        id=appt.id,
        patient_name=appt.patient_name,
        patient_id=appt.patient_id,
        department=appt.department.name,
        staff=appt.staff.full_name,
        room_no=appt.room_no,
        phone_no=appt.phone_no,
        appointment_type=appt.appointment_type,
        status=appt.status,
        created_at=appt.created_at,
        updated_at=appt.updated_at,
    )

# ---------- Routes ----------
@router.post("/create_appointment", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def create_appointment(payload: AppointmentCreate):
    try:
        # Get department and staff using sync_to_async
        department = await sync_to_async(Department.objects.get)(id=payload.department_id)
        staff = await sync_to_async(Staff.objects.get)(id=payload.staff_id)
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")

    # Create appointment with transaction.atomic
    @sync_to_async
    def create_appointment_with_transaction():
        with transaction.atomic():
            appointment = Appointment.objects.create(
                patient_name=payload.patient_name,
                department=department,
                staff=staff,
                room_no=payload.room_no,
                phone_no=payload.phone_no,
                appointment_type=payload.appointment_type,
                status=payload.status,
            )
            # Return the full object with relationships loaded
            return Appointment.objects.select_related('department', 'staff').get(id=appointment.id)

    try:
        appointment = await create_appointment_with_transaction()
        return appointment_to_out(appointment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create appointment: {str(e)}")

@router.get("/list_appointments", response_model=List[AppointmentOut])
async def list_appointments():
    @sync_to_async
    def get_appointments():
        return list(Appointment.objects.select_related('department', 'staff').all().order_by("-created_at"))
    
    appointments = await get_appointments()
    return [appointment_to_out(appt) for appt in appointments]

@router.put("/{appointment_id}", response_model=AppointmentOut)
async def update_appointment(appointment_id: int, payload: AppointmentUpdate):
    @sync_to_async
    def get_appointment():
        try:
            return Appointment.objects.select_related('department', 'staff').get(id=appointment_id)
        except Appointment.DoesNotExist:
            return None
    
    appt = await get_appointment()
    if appt is None:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Update fields
    if payload.patient_name is not None:
        appt.patient_name = payload.patient_name
    if payload.department_id is not None:
        try:
            department = await sync_to_async(Department.objects.get)(id=payload.department_id)
            appt.department = department
        except Department.DoesNotExist:
            raise HTTPException(status_code=404, detail="Department not found")
    if payload.staff_id is not None:
        try:
            staff = await sync_to_async(Staff.objects.get)(id=payload.staff_id)
            appt.staff = staff
        except Staff.DoesNotExist:
            raise HTTPException(status_code=404, detail="Staff not found")
    if payload.room_no is not None:
        appt.room_no = payload.room_no
    if payload.phone_no is not None:
        appt.phone_no = payload.phone_no
    if payload.appointment_type is not None:
        appt.appointment_type = payload.appointment_type
    if payload.status is not None:
        appt.status = payload.status

    @sync_to_async
    def save_appointment():
        with transaction.atomic():
            appt.save()
            # Return the updated object with relationships loaded
            return Appointment.objects.select_related('department', 'staff').get(id=appt.id)

    try:
        updated_appt = await save_appointment()
        return appointment_to_out(updated_appt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update appointment: {str(e)}")


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: int):
    @sync_to_async
    def delete_appt():
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            appointment.delete()
            return True
        except Appointment.DoesNotExist:
            return False
    
    deleted = await delete_appt()
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return None