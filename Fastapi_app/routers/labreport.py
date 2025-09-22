# fastapi_app/routers/labreport.py
from fastapi import APIRouter, HTTPException, status
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from typing import ClassVar
from django.db import transaction, IntegrityError
from HMS_backend.models import LabReport, Patient
from datetime import datetime

router = APIRouter(prefix="/labreports", tags=["Lab Reports"])

# ---------- Schemas ----------

class LabReportCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=200)
    patient_id: str = Field(..., min_length=1, max_length=50)
    department: str = Field(..., min_length=1, max_length=100)
    test_type: str = Field(..., min_length=1, max_length=100)
    # Status removed from create; automatically 'pending'

class LabReportUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_id: Optional[str] = None
    department: Optional[str] = None
    test_type: Optional[str] = None
    status: Optional[str] = None

    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        v = v.lower().strip()
        if v not in ["pending", "inprogress", "completed"]:
            raise ValueError("Status must be pending, inprogress, or completed")
        return v

    def model_post_init(self, __context):
        if self.status is not None:
            self.status = self.validate_status(self.status)

class LabReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: str
    patient_name: str
    patient_id: str  # This should be the patient_unique_id, not the FK id
    department: str
    test_type: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Fix for Pydantic v2: ClassVar
    model_getter_dict: ClassVar = None  # placeholder if you need custom getter

# ---------- Utility ----------

def generate_order_id() -> str:
    last = LabReport.objects.all().order_by("id").last()
    if not last:
        return "LABID0001"
    last_id_num = int(last.order_id.replace("LABID", ""))
    return f"LABID{last_id_num + 1:04d}"

# ---------- Routes ----------

@router.post("/create", response_model=LabReportOut, status_code=status.HTTP_201_CREATED)
def create_labreport(payload: LabReportCreate):
    """
    Create a Lab Report. Status is automatically set to 'pending'.
    Patient must exist in Patient table.
    """
    try:
        patient = Patient.objects.get(patient_unique_id=payload.patient_id)
        if patient.full_name != payload.patient_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient name does not match patient ID."
            )
    except Patient.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found."
        )

    try:
        with transaction.atomic():
            lab = LabReport.objects.create(
                order_id=generate_order_id(),
                patient=patient,
                department=payload.department.strip(),
                test_type=payload.test_type.strip(),
                status="pending"
            )
            # Create response with the correct patient_id (patient_unique_id)
            response_data = {
                "id": lab.id,
                "order_id": lab.order_id,
                "patient_name": lab.patient.full_name,
                "patient_id": lab.patient.patient_unique_id,  # Use patient_unique_id instead of FK id
                "department": lab.department,
                "test_type": lab.test_type,
                "status": lab.status,
                "created_at": lab.created_at,
                "updated_at": lab.updated_at
            }
            return LabReportOut(**response_data)
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Error creating lab report: {str(e)}"
        )

@router.get("/list", response_model=List[LabReportOut])
def list_labreports():
    """
    Fetch all Lab Reports.
    """
    labs = LabReport.objects.all().order_by("id").select_related('patient')
    lab_reports = []
    for lab in labs:
        lab_reports.append({
            "id": lab.id,
            "order_id": lab.order_id,
            "patient_name": lab.patient.full_name,
            "patient_id": lab.patient.patient_unique_id,  # Use patient_unique_id
            "department": lab.department,
            "test_type": lab.test_type,
            "status": lab.status,
            "created_at": lab.created_at,
            "updated_at": lab.updated_at
        })
    return [LabReportOut(**lab_data) for lab_data in lab_reports]

@router.put("/{labreport_id}", response_model=LabReportOut)
def update_labreport(labreport_id: int, payload: LabReportUpdate):
    """
    Update Lab Report by ID. Patient must exist if patient_id is updated.
    """
    try:
        lab = LabReport.objects.get(id=labreport_id)
    except LabReport.DoesNotExist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lab Report not found."
        )

    # Update patient if patient_id is provided
    if payload.patient_id:
        try:
            patient = Patient.objects.get(patient_unique_id=payload.patient_id)
            if payload.patient_name and patient.full_name != payload.patient_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Patient name does not match patient ID."
                )
            lab.patient = patient
        except Patient.DoesNotExist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found."
            )

    if payload.department:
        lab.department = payload.department.strip()
    if payload.test_type:
        lab.test_type = payload.test_type.strip()
    if payload.status:
        lab.status = payload.status.strip()

    lab.save()
    
    # Return response with correct patient_id
    response_data = {
        "id": lab.id,
        "order_id": lab.order_id,
        "patient_name": lab.patient.full_name,
        "patient_id": lab.patient.patient_unique_id,  # Use patient_unique_id
        "department": lab.department,
        "test_type": lab.test_type,
        "status": lab.status,
        "created_at": lab.created_at,
        "updated_at": lab.updated_at
    }
    return LabReportOut(**response_data)