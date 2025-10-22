from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from django.db.models import Q
from asgiref.sync import sync_to_async

from HMS_backend.models import Patient, Department, Staff, LabReport, MedicineAllocation

router = APIRouter(prefix="/medicine_allocation", tags=["Medicine Allocation"])

SECRET_KEY = "super_secret_123"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------- Pydantic Schemas ----------

class PatientResponse(BaseModel):
    id: int
    patient_unique_id: str
    full_name: str
    email_address: Optional[EmailStr] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    department: Optional[str] = None
    room_number: Optional[str] = None
    consultation_type: Optional[str] = None
    blood_pressure: Optional[str] = None
    body_temperature: Optional[float] = None
    heart_rate: Optional[int] = None


class PatientSearchResponse(BaseModel):
    id: int
    patient_unique_id: str
    full_name: str


class MedicineAllocationCreate(BaseModel):
    medicine_name: str
    dosage: str
    quantity: Optional[str] = None
    frequency: Optional[str] = None
    duration: str
    time: Optional[str] = None
    lab_test_type: Optional[str] = None


class MedicineAllocationResponse(BaseModel):
    id: int
    patient_name: str
    patient_id: str
    department: Optional[str] = None
    doctor: Optional[str] = None
    allocation_date: str
    medicine_name: str
    dosage: str
    duration: str
    lab_test_type: Optional[str] = None


class LabTestResponse(BaseModel):
    id: int
    order_id: str
    test_type: str
    status: str


class AllocationRequest(BaseModel):
    medicines: List[MedicineAllocationCreate]


class AllocationResponse(BaseModel):
    medicines: List[MedicineAllocationResponse]
    lab_tests: List[LabTestResponse]


class LabTestTypeResponse(BaseModel):
    test_type: str


# ---------- Dependency to Get Current Staff ----------
async def get_current_staff(token: str = Depends(oauth2_scheme)):
    staff_id = 1  # Replace with JWT decoding logic if you have it
    try:
        staff = await sync_to_async(Staff.objects.get)(id=staff_id)
        return staff
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")


# ---------- Fetch Distinct Lab Test Types ----------
@router.get("/lab-test-types/", response_model=List[LabTestTypeResponse])
async def get_lab_test_types():
    try:
        test_types = await sync_to_async(list)(
            LabReport.objects.values("test_type").distinct()
        )
        return [LabTestTypeResponse(test_type=t["test_type"]) for t in test_types]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Search Patients ----------
@router.get("/search/", response_model=List[PatientSearchResponse])
async def search_patients(query: str = ""):
    try:
        patients = await sync_to_async(list)(
            Patient.objects.filter(
                Q(full_name__icontains=query) |
                Q(patient_unique_id__icontains=query)
            ).values("id", "patient_unique_id", "full_name")
        )
        return [PatientSearchResponse(**p) for p in patients]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Fetch Patient Profile ----------
@router.get("/{patient_id}/", response_model=PatientResponse)
async def get_patient_profile(patient_id: int):
    try:
        patient = await sync_to_async(Patient.objects.select_related("department", "staff").get)(id=patient_id)
        return PatientResponse(
            id=patient.id,
            patient_unique_id=patient.patient_unique_id,
            full_name=patient.full_name,
            email_address=patient.email_address,
            gender=patient.gender,
            age=patient.age,
            blood_group=patient.blood_group,
            department=patient.department.name if patient.department else None,
            room_number=patient.room_number,
            consultation_type=patient.consultation_type,
            blood_pressure=patient.blood_pressure,
            body_temperature=patient.body_temperature,
            heart_rate=patient.heart_rate
        )
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Allocate Medicines and Lab Tests ----------
from django.db import transaction

# Synchronous version (change the endpoint to sync)
@router.post("/{patient_id}/allocations/", response_model=AllocationResponse)
def allocate_medicines_and_lab_tests(
    patient_id: int,
    allocation: AllocationRequest,
    current_staff: Staff = Depends(get_current_staff),
):
    try:
        with transaction.atomic():
            patient = Patient.objects.get(id=patient_id)
            department = patient.department
            allocations = []
            lab_reports = []

            for med in allocation.medicines:
                lab_report = None

                if med.lab_test_type:
                    lab_report = LabReport.objects.create(
                        patient=patient,
                        department=department.name if department else "",
                        test_type=med.lab_test_type,
                        status="pending",
                    )
                    lab_reports.append(
                        LabTestResponse(
                            id=lab_report.id,
                            order_id=lab_report.order_id,
                            test_type=lab_report.test_type,
                            status=lab_report.status,
                        )
                    )

                medicine_allocation = MedicineAllocation.objects.create(
                    patient=patient,
                    staff=current_staff,
                    department=department,
                    lab_report=lab_report,
                    medicine_name=med.medicine_name,
                    dosage=med.dosage,
                    quantity=med.quantity,
                    frequency=med.frequency,
                    duration=med.duration,
                    time=med.time,
                    allocation_date=date.today(),
                )

                allocations.append(
                    MedicineAllocationResponse(
                        id=medicine_allocation.id,
                        patient_name=patient.full_name,
                        patient_id=patient.patient_unique_id,
                        department=department.name if department else None,
                        doctor=current_staff.full_name,
                        allocation_date=medicine_allocation.allocation_date.strftime("%d-%m-%Y"),
                        medicine_name=medicine_allocation.medicine_name,
                        dosage=medicine_allocation.dosage,
                        duration=medicine_allocation.duration,
                        lab_test_type=med.lab_test_type,
                    )
                )

            return AllocationResponse(medicines=allocations, lab_tests=lab_reports)

    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Fetch Medicine Allocation History ----------
@router.get("/{patient_id}/medicine-allocations/", response_model=List[MedicineAllocationResponse])
async def get_medicine_allocations(patient_id: int):
    try:
        allocations = await sync_to_async(list)(
            MedicineAllocation.objects.select_related("patient", "department", "staff", "lab_report")
            .filter(patient__id=patient_id)
            .all()
        )
        return [
            MedicineAllocationResponse(
                id=a.id,
                patient_name=a.patient.full_name,
                patient_id=a.patient.patient_unique_id,
                department=a.department.name if a.department else None,
                doctor=a.staff.full_name if a.staff else None,
                allocation_date=a.allocation_date.strftime("%d-%m-%Y"),
                medicine_name=a.medicine_name,
                dosage=a.dosage,
                duration=a.duration,
                lab_test_type=a.lab_report.test_type if a.lab_report else None
            )
            for a in allocations
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Delete Medicine Allocation ----------
@router.delete("/{patient_id}/medicine-allocations/{allocation_id}/")
async def delete_medicine_allocation(patient_id: int, allocation_id: int):
    try:
        allocation = await sync_to_async(MedicineAllocation.objects.get)(id=allocation_id, patient__id=patient_id)
        await sync_to_async(allocation.delete)()
        return {"message": "Medicine allocation deleted successfully"}
    except MedicineAllocation.DoesNotExist:
        raise HTTPException(status_code=404, detail="Medicine allocation not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Fetch Lab Tests ----------
@router.get("/{patient_id}/lab-tests/", response_model=List[LabTestResponse])
async def get_lab_tests(patient_id: int):
    try:
        lab_reports = await sync_to_async(list)(
            LabReport.objects.select_related("patient").filter(patient__id=patient_id).all()
        )
        return [
            LabTestResponse(
                id=r.id,
                order_id=r.order_id,
                test_type=r.test_type,
                status=r.status
            )
            for r in lab_reports
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Delete Lab Test ----------
@router.delete("/{patient_id}/lab-tests/{lab_test_id}/")
async def delete_lab_test(patient_id: int, lab_test_id: int):
    try:
        lab_report = await sync_to_async(LabReport.objects.get)(id=lab_test_id, patient__id=patient_id)
        await sync_to_async(MedicineAllocation.objects.filter(lab_report=lab_report).update)(lab_report=None)
        await sync_to_async(lab_report.delete)()
        return {"message": "Lab test deleted successfully"}
    except LabReport.DoesNotExist:
        raise HTTPException(status_code=404, detail="Lab test not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
