from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date
from django.db.models import Q
from HMS_backend.models import Patient, Department, Staff, LabReport, MedicineAllocation

router = APIRouter(prefix="/medicine_allocation", tags=["Medicine Allocation"])

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
    lab_test_types: Optional[List[str]] = None

class AllocationResponse(BaseModel):
    medicines: List[MedicineAllocationResponse]
    lab_tests: List[LabTestResponse]

class LabTestTypeResponse(BaseModel):
    test_type: str


# ---------- Dependency to Get Current Staff ----------
def get_current_staff(token: str = Depends(oauth2_scheme)):
    staff_id = 1  # Replace this with real JWT decode logic
    try:
        staff = Staff.objects.get(id=staff_id)
        return staff
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")


# ---------- Allocate Medicines and Lab Tests ----------
@router.post("/{patient_id}/allocations/", response_model=AllocationResponse)
def allocate_medicines_and_lab_tests(
    patient_id: int,
    allocation: AllocationRequest,
    current_staff: Staff = Depends(get_current_staff),
):
    try:
        patient = Patient.objects.get(id=patient_id)
        department = patient.department

        allocations = []
        lab_reports = []

        # ✅ Create lab tests (if provided)
        if allocation.lab_test_types:
            for test_type in allocation.lab_test_types:
                lab_report = LabReport.objects.create(
                    patient=patient,
                    department=department.name if department else "",
                    test_type=test_type,
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

        # ✅ Create medicine allocations
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
        import traceback
        print("ERROR TRACEBACK:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ---------- Fetch Medicine Allocation History ----------
@router.get("/{patient_id}/medicine-allocations/", response_model=List[MedicineAllocationResponse])
def get_medicine_allocations(patient_id: int):
    allocations = MedicineAllocation.objects.select_related("patient", "department", "staff", "lab_report") \
        .filter(patient__id=patient_id).all()
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


# ---------- Delete Medicine Allocation ----------
@router.delete("/{patient_id}/medicine-allocations/{allocation_id}/")
def delete_medicine_allocation(patient_id: int, allocation_id: int):
    try:
        allocation = MedicineAllocation.objects.get(id=allocation_id, patient__id=patient_id)
        allocation.delete()
        return {"message": "Medicine allocation deleted successfully"}
    except MedicineAllocation.DoesNotExist:
        raise HTTPException(status_code=404, detail="Medicine allocation not found")


# # ---------- Fetch Lab Tests ----------
# @router.get("/{patient_id}/lab-tests/", response_model=List[LabTestResponse])
# def get_lab_tests(patient_id: int):
#     lab_reports = LabReport.objects.select_related("patient").filter(patient__id=patient_id).all()
#     return [
#         LabTestResponse(
#             id=r.id,
#             order_id=r.order_id,
#             test_type=r.test_type,
#             status=r.status
#         )
#         for r in lab_reports
#     ]


# # ---------- Delete Lab Test ----------
# @router.delete("/{patient_id}/lab-tests/{lab_test_id}/")
# def delete_lab_test(patient_id: int, lab_test_id: int):
#     try:
#         lab_report = LabReport.objects.get(id=lab_test_id, patient__id=patient_id)
#         MedicineAllocation.objects.filter(lab_report=lab_report).update(lab_report=None)
#         lab_report.delete()
#         return {"message": "Lab test deleted successfully"}
#     except LabReport.DoesNotExist:
#         raise HTTPException(status_code=404, detail="Lab test not found")
