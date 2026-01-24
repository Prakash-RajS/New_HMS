# surgery.py
from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Optional, Literal
from pydantic import BaseModel, validator, Field
from datetime import datetime, date, time
from django.db import connection, transaction
from django.db.models import Q
from Fastapi_app.routers.user_profile import get_current_user
from HMS_backend.models import Surgery, Patient, Staff, User, TreatmentCharge
from asgiref.sync import sync_to_async
from starlette.concurrency import run_in_threadpool
from django.db import close_old_connections, connection
 
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
        


router = APIRouter(prefix="/surgeries", tags=["Surgeries"])

# ---------- Schemas ----------
class SurgeryCreate(BaseModel):
    patient_id: int
    doctor_id: int
    surgery_type: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: Literal["pending", "success", "cancelled", "failed"] = "pending"
    scheduled_date: datetime = Field(..., description="Scheduled date and time")

    @validator("surgery_type")
    def validate_surgery_type(cls, v):
        if not v.strip():
            raise ValueError("Surgery type cannot be empty")
        if len(v.strip()) < 2:
            raise ValueError("Surgery type must be at least 2 characters")
        return v.strip()

    @validator("scheduled_date")
    def validate_future_date(cls, v):
        if v < datetime.now():
            raise ValueError("Surgery date cannot be in the past")
        return v

class SurgeryUpdate(BaseModel):
    patient_id: Optional[int] = None
    doctor_id: Optional[int] = None
    surgery_type: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[Literal["pending", "success", "cancelled", "failed"]] = None
    price: Optional[float] = Field(None, ge=0, description="Surgery price")
    scheduled_date: Optional[datetime] = None

    @validator("surgery_type")
    def validate_surgery_type_update(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError("Surgery type cannot be empty")
            if len(v.strip()) < 2:
                raise ValueError("Surgery type must be at least 2 characters")
        return v.strip() if v else v

    # @validator("scheduled_date")
    # def validate_future_date_update(cls, v):
    #     if v and v < datetime.now():
    #         raise ValueError("Surgery date cannot be in the past")
    #     return v

    @validator("price")
    def validate_price(cls, v, values):
        if v is not None and v < 0:
            raise ValueError("Price cannot be negative")
        return v

class SurgeryOut(BaseModel):
    id: int
    patient_id: int
    patient_name: str
    doctor_id: int
    doctor_name: str
    surgery_type: str
    description: Optional[str]
    status: str
    price: Optional[float] = None
    scheduled_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        arbitrary_types_allowed = True

# ---------- Helper ----------
def surgery_to_out(surgery: Surgery) -> SurgeryOut:
    return SurgeryOut(
        id=surgery.id,
        patient_id=surgery.patient.id,
        patient_name=surgery.patient.full_name,
        doctor_id=surgery.doctor.id if surgery.doctor else 0,
        doctor_name=surgery.doctor.full_name if surgery.doctor else "Not Assigned",
        surgery_type=surgery.surgery_type,
        description=surgery.description,
        status=surgery.status,
        price=float(surgery.price) if surgery.price else None,
        scheduled_date=surgery.scheduled_date,
        created_at=surgery.created_at,
        updated_at=surgery.updated_at,
    )

# ---------- Routes ----------

@router.post("/create", response_model=SurgeryOut, status_code=status.HTTP_201_CREATED)
async def create_surgery(payload: SurgeryCreate):
    @sync_to_async
    def get_patient(patient_id):
        ensure_db_connection()
        try:
            return Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return None

    @sync_to_async
    def get_doctor(doctor_id):
        ensure_db_connection()
        try:
            return Staff.objects.get(id=doctor_id)
        except Staff.DoesNotExist:
            return None

    patient = await get_patient(payload.patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    doctor = await get_doctor(payload.doctor_id)
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    @sync_to_async
    def create_surgery_with_transaction():
        ensure_db_connection()
        with transaction.atomic():
            surgery = Surgery.objects.create(
                patient=patient,
                doctor=doctor,
                surgery_type=payload.surgery_type,
                description=payload.description,
                status=payload.status,
                scheduled_date=payload.scheduled_date,
            )
            return Surgery.objects.select_related('patient', 'doctor').get(id=surgery.id)

    try:
        surgery = await create_surgery_with_transaction()
        return surgery_to_out(surgery)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create surgery: {str(e)}")

@router.get("/list", response_model=List[SurgeryOut])
async def list_surgeries(
    patient_id: Optional[int] = Query(None, description="Filter by patient ID"),
    doctor_id: Optional[int] = Query(None, description="Filter by doctor ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by surgery type or patient name")
):
    @sync_to_async
    def get_surgeries():
        ensure_db_connection()
        queryset = Surgery.objects.select_related('patient', 'doctor').all()

        # Apply filters
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(
                Q(surgery_type__icontains=search) |
                Q(patient__full_name__icontains=search)
            )

        return list(queryset.order_by("id"))

    surgeries = await get_surgeries()
    return [surgery_to_out(surgery) for surgery in surgeries]

@router.put("/{surgery_id}", response_model=SurgeryOut)
async def update_surgery(surgery_id: int, payload: SurgeryUpdate):
    @sync_to_async
    def get_surgery():
        ensure_db_connection()
        try:
            return Surgery.objects.select_related('patient', 'doctor').get(id=surgery_id)
        except Surgery.DoesNotExist:
            return None

    surgery = await get_surgery()

    if surgery is None:
        raise HTTPException(status_code=404, detail="Surgery not found")

    # Store old status before updating
    old_status = surgery.status
    old_price = surgery.price

    # Additional validation: price is required when status changes to success or failed
    if payload.status in ['success', 'failed'] and payload.price is None and surgery.price is None:
        raise HTTPException(
            status_code=400, 
            detail="Price is required when status is changed to success or failed"
        )

    # Update fields
    if payload.patient_id is not None:
        @sync_to_async
        def get_patient(patient_id):
            ensure_db_connection()
            try:
                return Patient.objects.get(id=patient_id)
            except Patient.DoesNotExist:
                return None

        patient = await get_patient(payload.patient_id)
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")
        surgery.patient = patient

    if payload.doctor_id is not None:
        @sync_to_async
        def get_doctor(doctor_id):
            ensure_db_connection()
            try:
                return Staff.objects.get(id=doctor_id)
            except Staff.DoesNotExist:
                return None

        doctor = await get_doctor(payload.doctor_id)
        if doctor is None:
            raise HTTPException(status_code=404, detail="Doctor not found")
        surgery.doctor = doctor

    if payload.surgery_type is not None:
        surgery.surgery_type = payload.surgery_type
    if payload.description is not None:
        surgery.description = payload.description

    # Check if status is changing to success or failed
    status_changed_to_success_or_failed = (
        payload.status in ['success', 'failed'] and 
        old_status not in ['success', 'failed']
    )

    if payload.status is not None:
        surgery.status = payload.status

    new_price = payload.price if payload.price is not None else old_price
    if payload.price is not None:
        surgery.price = payload.price

    if payload.scheduled_date is not None:
        surgery.scheduled_date = payload.scheduled_date

    @sync_to_async
    def save_surgery_with_treatment_charge():
        ensure_db_connection()
        with transaction.atomic():
            # Save the surgery
            surgery.save()

            # Check if status changed to success or failed and create treatment charge
            if (status_changed_to_success_or_failed and 
                new_price and 
                new_price > 0):

                # Check if a treatment charge already exists for this surgery
                existing_charge = TreatmentCharge.objects.filter(
                    patient=surgery.patient,
                    description=f"OT - {surgery.surgery_type}",
                    unit_price=new_price
                ).first()

                if not existing_charge:
                    # Create TreatmentCharge entry
                    TreatmentCharge.objects.create(
                        patient=surgery.patient,
                        description=f"OT - {surgery.surgery_type}",  # Include surgery type
                        quantity=1,
                        unit_price=new_price,
                        # amount will be auto-calculated (quantity * unit_price)
                        status=TreatmentCharge.PENDING
                    )
                    print(f"✅ Treatment charge created for surgery: {surgery.surgery_type} - ₹{new_price}")

            # Update doctor's surgery count if status changed to success or failed
            if (status_changed_to_success_or_failed and surgery.doctor):
                if surgery.doctor.surgery_count is None:
                    surgery.doctor.surgery_count = 0
                surgery.doctor.surgery_count += 1
                surgery.doctor.save(update_fields=['surgery_count'])
                print(f"✅ Surgery count incremented for doctor {surgery.doctor.full_name}: {surgery.doctor.surgery_count}")

            return Surgery.objects.select_related('patient', 'doctor').get(id=surgery.id)

    try:
        updated_surgery = await save_surgery_with_treatment_charge()
        return surgery_to_out(updated_surgery)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update surgery: {str(e)}")

@router.delete("/{surgery_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_surgery(surgery_id: int):
    @sync_to_async
    def delete_surgery_func():
        ensure_db_connection()
        try:
            surgery = Surgery.objects.get(id=surgery_id)
            surgery.delete()
            return True
        except Surgery.DoesNotExist:
            return False

    deleted = await delete_surgery_func()
    if not deleted:
        raise HTTPException(status_code=404, detail="Surgery not found")

# Get all patients for dropdown
@router.get("/patients", response_model=List[dict])
async def get_patients():
    patients = await run_in_threadpool(
        lambda: (ensure_db_connection(), list(
            Patient.objects.all()
            .values("id", "full_name", "patient_unique_id")
            .order_by("full_name")
        ))[1]
    )
    return patients

# Get all doctors for dropdown
@router.get("/doctors", response_model=List[dict])
async def get_doctors():
    doctors = await run_in_threadpool(
        lambda: (ensure_db_connection(), list(
            Staff.objects.filter(designation__icontains="doctor")
            .values("id", "full_name", "employee_id")
            .order_by("full_name")
        ))[1]
    )
    return doctors