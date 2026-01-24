# Fastapi_app/routers/labreports.py
from fastapi import APIRouter, HTTPException, status, Response, UploadFile, File, Form, Request
from fastapi.responses import FileResponse, RedirectResponse
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import ClassVar
from django.db import transaction, IntegrityError
from django.core.exceptions import ObjectDoesNotExist
import os
import sys
from datetime import datetime
from pathlib import Path
import uuid

# Django setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")
import django
django.setup()


from HMS_backend.models import LabReport, Patient, MedicalTest, TreatmentCharge
from Fastapi_app.routers.notifications import NotificationService
from asgiref.sync import sync_to_async, async_to_sync

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

# Assuming this is in Fastapi_app/routers/labreports.py
# Set UPLOAD_DIR relative to Fastapi_app
BASE_DIR_PATH = Path(__file__).resolve().parent.parent  # Points to Fastapi_app
UPLOAD_DIR = BASE_DIR_PATH / "uploads" / "lab_reports"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/labreports", tags=["Lab Reports"])

# ---------- Configuration ----------
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"}


# ---------- Schemas ----------
class LabReportCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=200)
    patient_id: str = Field(..., min_length=1, max_length=50)
    department: str = Field(..., min_length=1, max_length=100)
    test_type: str = Field(..., min_length=1, max_length=100)


class LabReportUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_id: Optional[str] = None
    department: Optional[str] = None
    test_type: Optional[str] = None
    status: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is None:
            return v
        v = v.lower().strip()
        if v not in {"pending", "inprogress", "completed"}:
            raise ValueError("Status must be pending, inprogress, or completed")
        return v


class LabReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: str
    patient_name: str
    patient_id: str
    department: str
    test_type: str
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    file_path: Optional[str] = None  # URL or relative path to uploaded file


# ---------- Utility ----------
@sync_to_async
def generate_order_id() -> str:
    ensure_db_connection()
    last = LabReport.objects.all().order_by("id").last()
    if not last:
        return "LABID0001"
    last_id_num = int(last.order_id.replace("LABID", ""))
    return f"LABID{last_id_num + 1:04d}"


def save_uploaded_file(file: UploadFile) -> str:
    """Save uploaded file and return relative path"""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    filename = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / filename
    with open(file_path, "wb") as f:
        content = file.file.read()
        f.write(content)
    return f"/uploads/lab_reports/{filename}"  # Relative URL for serving


# ---------- Routes ----------
@router.get("/test-types")
async def get_test_types():
    try:
        @sync_to_async
        def fetch_tests():
            ensure_db_connection()
            return list(
                MedicalTest.objects.filter(status="available").order_by("test_type")
            )
        
        tests = await fetch_tests()
        test_types = [test.test_type for test in tests]
        return {"test_types": test_types}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching test types: {str(e)}"
        )


@router.post("/create", response_model=LabReportOut, status_code=status.HTTP_201_CREATED)
async def create_labreport(
    patient_name: str = Form(...),
    patient_id: str = Form(...),
    department: str = Form(...),
    test_type: str = Form(...),
):
    try:
        @sync_to_async
        def get_patient():
            ensure_db_connection()
            return Patient.objects.get(patient_unique_id=patient_id)
        
        patient = await get_patient()
        if patient.full_name.strip().lower() != patient_name.strip().lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient name does not match patient ID."
            )
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found.")

    try:
        @sync_to_async
        def create_lab():
            ensure_db_connection()
            with transaction.atomic():
                lab = LabReport.objects.create(
                    order_id=async_to_sync(generate_order_id)(),
                    patient=patient,
                    department=department.strip(),
                    test_type=test_type.strip(),
                    status="pending",
                )
                return lab

        lab = await create_lab()

        await NotificationService.send_lab_report_created(lab)

        response_data = {
            "id": lab.id,
            "order_id": lab.order_id,
            "patient_name": lab.patient.full_name,
            "patient_id": lab.patient.patient_unique_id,
            "department": lab.department,
            "test_type": lab.test_type,
            "status": lab.status,
            "created_at": lab.created_at,
            "updated_at": lab.updated_at,
            "file_path": None,
        }
        return LabReportOut(**response_data)

    except IntegrityError as e:
        raise HTTPException(status_code=409, detail=f"Error creating lab report: {str(e)}")


@router.get("/list", response_model=List[LabReportOut])
async def list_labreports():
    @sync_to_async
    def fetch_labs():
        ensure_db_connection()
        return list(
            LabReport.objects.all().order_by("-id").select_related("patient")
        )
    
    labs = await fetch_labs()
    lab_reports = []
    for lab in labs:
        lab_reports.append(
            {
                "id": lab.id,
                "order_id": lab.order_id,
                "patient_name": lab.patient.full_name,
                "patient_id": lab.patient.patient_unique_id,
                "department": lab.department,
                "test_type": lab.test_type,
                "status": lab.status,
                "created_at": lab.created_at,
                "updated_at": lab.updated_at,
                "file_path": lab.file_path,  # Assuming you add file_path field to LabReport model
            }
        )
    return lab_reports


@router.put("/{labreport_id}", response_model=LabReportOut)
async def update_labreport(
    labreport_id: int,
    patient_name: Optional[str] = Form(None),
    patient_id: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    test_type: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    lab_report_file: Optional[UploadFile] = File(None),
):
    try:
        @sync_to_async
        def get_lab():
            ensure_db_connection()
            return LabReport.objects.select_related("patient").get(id=labreport_id)
        
        lab = await get_lab()
    except LabReport.DoesNotExist:
        raise HTTPException(status_code=404, detail="Lab Report not found.")

    old_status = lab.status
    file_path = lab.file_path  # Keep existing if not uploading new

    # Handle patient update
    if patient_id:
        try:
            @sync_to_async
            def get_patient_update():
                ensure_db_connection()
                return Patient.objects.get(patient_unique_id=patient_id)
            
            patient = await get_patient_update()
            if patient_name and patient.full_name.strip().lower() != patient_name.strip().lower():
                raise HTTPException(status_code=400, detail="Patient name does not match patient ID.")
            lab.patient = patient
        except Patient.DoesNotExist:
            raise HTTPException(status_code=404, detail="Patient not found.")

    if patient_name and not patient_id:
        # Optional: allow name update without changing patient (if needed)
        pass

    if department:
        lab.department = department.strip()
    if test_type:
        lab.test_type = test_type.strip()
    if status:
        lab.status = status.lower().strip()

    # Handle file upload only when status becomes "completed"
    if lab_report_file and lab.status == "completed":
        file_path = save_uploaded_file(lab_report_file)
        lab.file_path = file_path
    elif lab.status == "completed" and not lab_report_file and not lab.file_path:
        raise HTTPException(
            status_code=400,
            detail="A lab report file is required when status is set to 'completed'."
        )

    @sync_to_async
    def save_lab():
        ensure_db_connection()
        lab.save()
    
    await save_lab()

    await NotificationService.send_lab_report_updated(lab)

    # Create TreatmentCharge when status changes to completed
    if lab.status == "completed" and lab.status != old_status:
        try:
            @sync_to_async
            def get_medical_test():
                ensure_db_connection()
                return MedicalTest.objects.filter(test_type__iexact=lab.test_type.strip()).first()
            
            medical_test = await get_medical_test()

            unit_price = float(medical_test.price) if medical_test and medical_test.price else 0.0
            amount = unit_price

            @sync_to_async
            def create_charge():
                ensure_db_connection()
                TreatmentCharge.objects.create(
                    patient=lab.patient,
                    description=f"Lab Test: {lab.test_type} (Order ID: {lab.order_id})",
                    quantity=1,
                    unit_price=unit_price,
                    amount=amount,
                    status=TreatmentCharge.PENDING,
                )
            
            await create_charge()

            await NotificationService.send_lab_report_completed(lab)
        except Exception as e:
            print(f"Error creating treatment charge: {e}")
            # Fallback charge with zero price
            @sync_to_async
            def create_fallback_charge():
                ensure_db_connection()
                TreatmentCharge.objects.create(
                    patient=lab.patient,
                    description=f"Lab Test: {lab.test_type} (Order ID: {lab.order_id})",
                    quantity=1,
                    unit_price=0,
                    amount=0,
                    status=TreatmentCharge.PENDING,
                )
            
            await create_fallback_charge()

    response_data = {
        "id": lab.id,
        "order_id": lab.order_id,
        "patient_name": lab.patient.full_name,
        "patient_id": lab.patient.patient_unique_id,
        "department": lab.department,
        "test_type": lab.test_type,
        "status": lab.status,
        "created_at": lab.created_at,
        "updated_at": lab.updated_at,
        "file_path": file_path,
    }
    return LabReportOut(**response_data)


@router.delete("/{labreport_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_labreport(labreport_id: int):
    try:
        @sync_to_async
        def get_lab_delete():
            ensure_db_connection()
            return LabReport.objects.select_related("patient").get(id=labreport_id)
        
        lab = await get_lab_delete()
    except LabReport.DoesNotExist:
        raise HTTPException(status_code=404, detail="Lab Report not found.")

    lab_data = {
        "order_id": lab.order_id,
        "patient_name": lab.patient.full_name if lab.patient else "Unknown",
    }

    # Optionally delete file from disk
    if lab.file_path:
        file_full_path = BASE_DIR_PATH / ".".join(lab.file_path.split("/")[1:])  # Adjust to absolute path
        if file_full_path.exists():
            file_full_path.unlink()

    @sync_to_async
    def delete_lab():
        ensure_db_connection()
        lab.delete()
    
    await delete_lab()
    await NotificationService.send_lab_report_deleted(lab_data)

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/download/{filename}")
async def download_lab_report(filename: str):
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Force download with custom filename
    return FileResponse(
        path=file_path,
        filename=f"Lab_Report_{filename.split('-')[0]}.pdf",  # Optional: cleaner name, adjust as needed
        media_type="application/octet-stream",  # Forces download
        headers={"Content-Disposition": f"attachment; filename=Lab_Report_{filename}"}
    )
    

@router.get("/{report_id}/view")
async def view_lab_report(report_id: int):
    try:
        @sync_to_async
        def get_report():
            ensure_db_connection()
            return LabReport.objects.get(id=report_id)
        
        report = await get_report()
        
        if not report.file_path:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Extract just the filename from the path
        # Assuming file_path is like "/uploads/lab_reports/filename.ext"
        filename = report.file_path.split('/')[-1] if '/' in report.file_path else report.file_path
        
        # Construct the URL to serve the file
        # This assumes you have static files mounted at /uploads
        file_url = f"/uploads/lab_reports/{filename}"
        return RedirectResponse(url=file_url)
        
    except ObjectDoesNotExist:
        raise HTTPException(status_code=404, detail="Report not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/{report_id}/download")
async def download_lab_report(report_id: int):
    try:
        @sync_to_async
        def get_report_download():
            ensure_db_connection()
            return LabReport.objects.get(id=report_id)
        
        report = await get_report_download()
        
        if not report.file_path:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Get the absolute file path
        # Assuming file_path is stored as relative path like "uploads/lab_reports/filename.ext"
        if report.file_path.startswith('/'):
            file_path_str = report.file_path[1:]  # Remove leading slash
        else:
            file_path_str = report.file_path
        
        file_path = Path(file_path_str)
        
        if not file_path.exists():
            # Try with absolute path
            file_path = BASE_DIR_PATH / file_path_str
            
            if not file_path.exists():
                raise HTTPException(status_code=404, detail="File not found on server")
        
        # Clean the test type for filename
        clean_test_type = report.test_type.replace(' ', '_').replace('/', '_')
        
        # Force download
        return FileResponse(
            path=file_path,
            filename=f"Lab_Report_{report_id}_{clean_test_type}{file_path.suffix}",
            media_type="application/octet-stream"
        )
        
    except ObjectDoesNotExist:
        raise HTTPException(status_code=404, detail="Report not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")