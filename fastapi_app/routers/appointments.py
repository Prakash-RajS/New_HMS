from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Optional, Literal
from pydantic import BaseModel, validator, Field
from datetime import datetime, date, time, timezone
from django.db import transaction
from django.db.models import Q
from Fastapi_app.routers.auth import get_current_user
from HMS_backend.models import Appointment, Department, Staff, User
from asgiref.sync import sync_to_async
from starlette.concurrency import run_in_threadpool
from Fastapi_app.routers.notifications import NotificationService


# Assuming you have auth setup - if not, we'll create a simple version
router = APIRouter(prefix="/appointments", tags=["Appointments"])

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()

# ---------- Schemas ----------
class AppointmentCreate(BaseModel):
    patient_name: str
    department_id: int
    staff_id: int
    room_no: str
    phone_no: str
    appointment_type: Literal["checkup", "followup", "emergency"]
    status: Literal["new", "normal", "severe","active","inactive","completed","cancelled","emergency"] = "new"
    appointment_date: date = Field(..., description="Appointment date")
    appointment_time: time = Field(..., description="Appointment time")

    @validator("appointment_date")
    def validate_future_date(cls, v):
        if v < date.today():
            raise ValueError("Appointment date cannot be in the past")
        return v
    
    @validator("appointment_time")
    def validate_time_with_date(cls, v, values):
        if 'appointment_date' in values and values['appointment_date'] == date.today():
            now = datetime.now().time()
            if v < now:
                raise ValueError("Appointment time cannot be in the past for today")
        return v

class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    department_id: Optional[int] = None
    staff_id: Optional[int] = None
    room_no: Optional[str] = None
    phone_no: Optional[str] = None
    appointment_type: Optional[Literal["checkup", "followup", "emergency"]] = None
    status: Optional[Literal["new", "normal", "severe", "completed", "cancelled","active","inactive","emergency"]] = None
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None

    @validator("appointment_date")
    def validate_future_date_on_update(cls, v):
        if v and v < date.today():
            raise ValueError("Appointment date cannot be in the past")
        return v
    
    @validator("appointment_time")
    def validate_time_with_date_update(cls, v, values):
        if v and 'appointment_date' in values and values['appointment_date'] == date.today():
            now = datetime.now().time()
            if v < now:
                raise ValueError("Appointment time cannot be in the past for today")
        return v

class AppointmentOut(BaseModel):
    id: int
    patient_name: str
    patient_id: str
    department: str
    doctor: str
    room_no: str
    phone_no: str
    appointment_type: str
    status: str
    appointment_date: date
    appointment_time: time
    appointment_datetime: Optional[datetime] = None  # Combined for backward compatibility
    created_at: datetime
    updated_at: datetime

    class Config:
        arbitrary_types_allowed = True

# ---------- Dropdown Response Models ----------
class DepartmentOut(BaseModel):
    id: int
    name: str

class StaffOut(BaseModel):
    id: int
    full_name: str

# ---------- Helper ----------
def appointment_to_out(appt: Appointment) -> AppointmentOut:
    
    return AppointmentOut(
        id=appt.id,
        patient_name=appt.patient_name,
        patient_id=appt.patient_id,
        department=appt.department.name if appt.department else '',
        doctor=appt.staff.full_name if appt.staff else '',
        room_no=appt.room_no,
        phone_no=appt.phone_no,
        appointment_type=appt.appointment_type,
        status=appt.status,
        appointment_date=appt.appointment_date,
        appointment_time=appt.appointment_time,
        created_at=appt.created_at,
        updated_at=appt.updated_at,
    )

# ---------- Routes ----------

@router.post("/create_appointment", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
async def create_appointment(payload: AppointmentCreate):
    try:
        department = await sync_to_async(Department.objects.get)(id=payload.department_id)
        staff = await sync_to_async(Staff.objects.get)(id=payload.staff_id)
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")

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
                appointment_date=payload.appointment_date,
                appointment_time=payload.appointment_time,
            )
            return Appointment.objects.select_related('department', 'staff').get(id=appointment.id)

    try:
        appointment = await create_appointment_with_transaction()
        await NotificationService.send_appointment_created(appointment, staff, department)
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
    if payload.appointment_date is not None:
        appt.appointment_date = payload.appointment_date
    if payload.appointment_time is not None:
        appt.appointment_time = payload.appointment_time

    @sync_to_async
    def save_appointment():
        with transaction.atomic():
            appt.save()
            return Appointment.objects.select_related('department', 'staff').get(id=appt.id)

    try:
        updated_appt = await save_appointment()
        await NotificationService.send_appointment_updated(updated_appt, updated_appt.staff, updated_appt.department)
        return appointment_to_out(updated_appt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update: {str(e)}")


@router.delete("/{appointment_id}", status_code=204)
async def delete_appointment(appointment_id: int):
    @sync_to_async
    def get_appointment_data():
        try:
            return Appointment.objects.select_related('staff', 'department').get(id=appointment_id)
        except Appointment.DoesNotExist:
            return None

    appointment = await get_appointment_data()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment_data = {
        'id': appointment.id,
        'patient_name': appointment.patient_name,
        'staff_name': appointment.staff.full_name if appointment.staff else "Unknown",
        'department_name': appointment.department.name if appointment.department else "Unknown"
    }

    @sync_to_async
    def delete_appt():
        try:
            Appointment.objects.get(id=appointment_id).delete()
            return True
        except Appointment.DoesNotExist:
            return False

    deleted = await delete_appt()
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")

    await NotificationService.send_appointment_deleted(appointment_data)
     

@router.get("/departments", response_model=List[DepartmentOut])
async def get_departments():
    depts = await run_in_threadpool(
        lambda: list(
            Department.objects.filter(status="active")
            .values("id", "name")
            .order_by("name")
        )
    )
    return depts


@router.get("/staff", response_model=List[StaffOut])
async def get_staff_by_department(department_id: int = Query(..., gt=0)):
    try:
        await run_in_threadpool(
            Department.objects.get, id=department_id, status="active"
        )
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found or inactive")

    staff = await run_in_threadpool(
        lambda: list(
            Staff.objects.filter(department_id=department_id, status="active")
            .values("id", "full_name")
            .order_by("full_name")
        )
    )
    return staff

# ---------- My Calendar Endpoint (For Logged-in Users) ----------
@router.get("/my-calendar/", response_model=List[AppointmentOut])
async def get_my_calendar_appointments(
    year: Optional[int] = Query(None, description="Year filter"),
    month: Optional[int] = Query(None, description="Month filter (1-12)"),
    current_user: User = Depends(get_current_user),  # Your auth dependency
):
    """
    Get appointments for the currently logged-in doctor/nurse
    """
    try:
        @sync_to_async
        def get_my_appointments():
            # Get staff profile for current user
            try:
                staff = Staff.objects.get(user=current_user)
                print(f"📅 Fetching appointments for logged-in user: {current_user.username}")
                print(f"👨‍⚕️ Staff: {staff.full_name} (ID: {staff.id})")
            except Staff.DoesNotExist:
                raise HTTPException(
                    status_code=404, 
                    detail="No staff profile found for your account. Please contact administrator."
                )
            
            # Get appointments for this staff
            queryset = Appointment.objects.select_related('department', 'staff').filter(staff_id=staff.id)
            
            # Apply year/month filter if provided - using appointment_date field
            if year and month:
                print(f"🔍 Filtering by: {year}-{month}")
                # Start of month
                start_date = date(year, month, 1)
                # End of month
                if month == 12:
                    end_date = date(year + 1, 1, 1)
                else:
                    end_date = date(year, month + 1, 1)
                
                # Filter by appointment_date field
                queryset = queryset.filter(
                    Q(appointment_date__gte=start_date, appointment_date__lt=end_date)
                )
            
            appointments_list = list(queryset.order_by('appointment_date', 'appointment_time', 'created_at'))
            print(f"✅ Found {len(appointments_list)} appointments")
            return appointments_list
        
        appointments = await get_my_appointments()
        return [appointment_to_out(appt) for appt in appointments]
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch appointments: {str(e)}")