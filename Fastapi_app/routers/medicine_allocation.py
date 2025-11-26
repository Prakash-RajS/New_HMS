import os
import logging
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, Path, Depends, status
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from jose import JWTError, jwt
from HMS_backend.models import Patient, Staff, MedicineAllocation, LabReport
from HMS_backend.models import Patient, Department, Staff, Stock
from fastapi_app.routers.notifications import NotificationService

router = APIRouter(prefix="/medicine_allocation", tags=["Medicine Allocation"])

# ---------- JWT Settings ----------
SECRET_KEY = "super_secret_123"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
PHOTO_DIR = "fastapi_app/Patient_photos"
os.makedirs(PHOTO_DIR, exist_ok=True)

def parse_date(date_str: Optional[str]):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None


# ---------- Helper to Safely Parse Optional Integers ----------
def parse_optional_int(value: Optional[str]):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None

# ---------- Pydantic Schemas ----------
class MedicineAllocationCreate(BaseModel):
    medicine_name: str
    dosage: str
    quantity: Optional[str] = None
    frequency: Optional[str] = None
    duration: str
    time: Optional[str] = None


class AllocationRequest(BaseModel):
    medicines: List[MedicineAllocationCreate]
    lab_test_types: Optional[List[str]] = []


class MedicineAllocationResponse(BaseModel):
    id: int
    patient_name: str
    patient_id: str
    doctor: Optional[str] = None
    allocation_date: str
    medicine_name: str
    dosage: str
    duration: str
    quantity: Optional[str] = None
    frequency: Optional[str] = None
    time: Optional[str] = None
    lab_report_ids: Optional[List[int]] = None
    lab_test_types: Optional[str] = None


class AllocationResponse(BaseModel):
    medicines: List[MedicineAllocationResponse]


# ---------- Dependency to Get Current Staff ----------
def get_current_staff(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        from HMS_backend.models import User
        user = User.objects.get(id=user_id)

        if not user.staff:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff not found for this user")

        return user.staff

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")


# ---------- Allocate Medicines and Lab Reports ----------
# ---------- Allocate Medicines and Lab Reports (Async Version) ----------
from asgiref.sync import sync_to_async
@router.post("/{patient_id}/allocations/", response_model=AllocationResponse)
async def allocate_medicines(
    patient_id: int,
    allocation: AllocationRequest,
    current_staff: Staff = Depends(get_current_staff),
):
    try:
        patient = await sync_to_async(Patient.objects.get)(id=patient_id)
        department = await sync_to_async(lambda: patient.department)()
        allocations = []

        # 1️⃣ Create all lab reports (if any)
        created_lab_reports = []
        for lab_type in allocation.lab_test_types or []:
            lab_report = await sync_to_async(LabReport.objects.create)(
                patient=patient,
                department=department.name if department else "General",
                test_type=lab_type,
                status="pending",
            )
            created_lab_reports.append(lab_report)

        # Prepare IDs and test names
        lab_report_ids_list = [l.id for l in created_lab_reports]
        lab_report_ids_str = ",".join(str(l.id) for l in created_lab_reports) if created_lab_reports else None
        lab_test_names = [l.test_type for l in created_lab_reports]
        lab_test_str = ", ".join(lab_test_names) if lab_test_names else None

        # 2️⃣ Create medicine allocations
        for med in allocation.medicines:
            medicine_allocation = await sync_to_async(MedicineAllocation.objects.create)(
                patient=patient,
                staff=current_staff,
                department=department,
                medicine_name=med.medicine_name,
                dosage=med.dosage,
                quantity=med.quantity,
                frequency=med.frequency,
                duration=med.duration,
                time=med.time,
                allocation_date=date.today(),
                lab_report_ids=lab_report_ids_str,
            )

            # ✅ ADD NOTIFICATION HERE (Now it's easy since we're async)
            await NotificationService.send_medicine_allocated(medicine_allocation)

            allocations.append(
                MedicineAllocationResponse(
                    id=medicine_allocation.id,
                    patient_name=patient.full_name,
                    patient_id=patient.patient_unique_id,
                    doctor=current_staff.full_name,
                    allocation_date=medicine_allocation.allocation_date.strftime("%d-%m-%Y"),
                    medicine_name=medicine_allocation.medicine_name,
                    dosage=medicine_allocation.dosage,
                    duration=medicine_allocation.duration,
                    quantity=medicine_allocation.quantity,
                    frequency=medicine_allocation.frequency,
                    time=medicine_allocation.time,
                    lab_report_ids=lab_report_ids_list,
                    lab_test_types=lab_test_str,
                )
            )

        return AllocationResponse(medicines=allocations)

    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    except Exception as e:
        import traceback
        print("ERROR TRACEBACK:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# ---------- Fetch Medicine Allocation History ----------
# ---------- Fetch Medicine Allocation History ----------
@router.get("/{patient_id}/medicine-allocations/", response_model=List[MedicineAllocationResponse])
def get_medicine_allocations(patient_id: int):
    try:
        allocations = (
            MedicineAllocation.objects
            .select_related("patient", "staff")
            .filter(patient__id=patient_id)
            .all()
        )

        results = []
        for a in allocations:
            # 🧩 Convert lab_report_ids from CSV string → list[int]
            lab_report_ids_list = []
            if a.lab_report_ids:
                if isinstance(a.lab_report_ids, str):
                    lab_report_ids_list = [int(x) for x in a.lab_report_ids.split(",") if x]
                elif isinstance(a.lab_report_ids, list):
                    lab_report_ids_list = [int(x) for x in a.lab_report_ids]
                else:
                    lab_report_ids_list = []

            # 🧩 Convert lab_report_ids to readable test names
            lab_test_types = None
            if lab_report_ids_list:
                tests = LabReport.objects.filter(id__in=lab_report_ids_list).values_list("test_type", flat=True)
                lab_test_types = ", ".join(tests) if tests else None

            results.append(
                MedicineAllocationResponse(
                    id=a.id,
                    patient_name=a.patient.full_name,
                    patient_id=a.patient.patient_unique_id,
                    doctor=a.staff.full_name if a.staff else None,
                    allocation_date=a.allocation_date.strftime("%d-%m-%Y"),
                    medicine_name=a.medicine_name,
                    dosage=a.dosage,
                    duration=a.duration,
                    quantity=a.quantity,
                    frequency=a.frequency,
                    time=a.time,
                    lab_report_ids=lab_report_ids_list,  # ✅ fixed
                    lab_test_types=lab_test_types,
                )
            )

        return results

    except Exception as e:
        import traceback
        print("ERROR TRACEBACK:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))



# ---------- Update Medicine Allocation ----------
@router.put("/{patient_id}/medicine-allocations/{allocation_id}/", response_model=MedicineAllocationResponse)
async def update_medicine_allocation(
    patient_id: int,
    allocation_id: int,
    medicine_data: MedicineAllocationCreate,
    current_staff: Staff = Depends(get_current_staff)
):
    try:
        # Get allocation with related data
        allocation = await sync_to_async(MedicineAllocation.objects.select_related("patient", "staff").get)(
            id=allocation_id, patient__id=patient_id
        )

        # Update fields
        allocation.medicine_name = medicine_data.medicine_name
        allocation.dosage = medicine_data.dosage
        allocation.quantity = medicine_data.quantity
        allocation.frequency = medicine_data.frequency
        allocation.duration = medicine_data.duration
        allocation.time = medicine_data.time
        
        await sync_to_async(allocation.save)()

        # ✅ ADD NOTIFICATION HERE
        await NotificationService.send_medicine_updated(allocation)

        # Convert lab_report_ids to list[int]
        lab_report_ids_list = []
        if allocation.lab_report_ids:
            if isinstance(allocation.lab_report_ids, str):
                lab_report_ids_list = [int(x) for x in allocation.lab_report_ids.split(",") if x]
            elif isinstance(allocation.lab_report_ids, list):
                lab_report_ids_list = [int(x) for x in allocation.lab_report_ids]
            else:
                lab_report_ids_list = []

        # Rebuild lab test names
        lab_test_types = None
        if lab_report_ids_list:
            tests = await sync_to_async(list)(
                LabReport.objects.filter(id__in=lab_report_ids_list).values_list("test_type", flat=True)
            )
            lab_test_types = ", ".join(tests) if tests else None

        return MedicineAllocationResponse(
            id=allocation.id,
            patient_name=allocation.patient.full_name,
            patient_id=allocation.patient.patient_unique_id,
            doctor=current_staff.full_name,
            allocation_date=allocation.allocation_date.strftime("%d-%m-%Y"),
            medicine_name=allocation.medicine_name,
            dosage=allocation.dosage,
            duration=allocation.duration,
            quantity=allocation.quantity,
            frequency=allocation.frequency,
            time=allocation.time,
            lab_report_ids=lab_report_ids_list,
            lab_test_types=lab_test_types,
        )

    except MedicineAllocation.DoesNotExist:
        raise HTTPException(status_code=404, detail="Medicine allocation not found")
    except Exception as e:
        import traceback
        print("UPDATE ERROR TRACEBACK:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))



# ---------- Delete Medicine Allocation ----------
@router.delete("/{patient_id}/medicine-allocations/{allocation_id}/")
async def delete_medicine_allocation(patient_id: int, allocation_id: int):
    try:
        # Get allocation with related data before deletion
        allocation = await sync_to_async(MedicineAllocation.objects.select_related("patient", "staff").get)(
            id=allocation_id, patient__id=patient_id
        )
        
        # Store data for notification before deletion
        allocation_data = {
            'id': allocation.id,
            'patient_name': allocation.patient.full_name,
            'medicine_name': allocation.medicine_name,
            'dosage': allocation.dosage,
            'staff_name': allocation.staff.full_name if allocation.staff else "Unknown"
        }
        
        lab_report_ids = allocation.lab_report_ids
        
        # Delete the allocation
        await sync_to_async(allocation.delete)()

        # ✅ ADD NOTIFICATION HERE
        await NotificationService.send_medicine_deleted(allocation_data)

        # Delete lab reports only if not linked elsewhere
        if lab_report_ids:
            ids = [int(x) for x in lab_report_ids.split(",") if x]
            for rid in ids:
                # Check if any other allocation uses this lab report
                other_allocations_exist = await sync_to_async(
                    MedicineAllocation.objects.filter(lab_report_ids__icontains=str(rid)).exists
                )()
                
                if not other_allocations_exist:
                    try:
                        report = await sync_to_async(LabReport.objects.get)(id=rid)
                        await sync_to_async(report.delete)()
                    except LabReport.DoesNotExist:
                        pass

        return {"message": "Medicine allocation (and unused lab reports) deleted successfully"}

    except MedicineAllocation.DoesNotExist:
        raise HTTPException(status_code=404, detail="Medicine allocation not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# ---------- Edit Patient ----------
@router.put("/{patient_id}/edit")
async def edit_patient(
    patient_id: str,
    full_name: Optional[str] = Form(None),
    date_of_birth: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[str] = Form(None),
    marital_status: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    email_address: Optional[str] = Form(None),
    national_id: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    date_of_registration: Optional[str] = Form(None),
    occupation: Optional[str] = Form(None),
    weight_in_kg: Optional[str] = Form(None),
    height_in_cm: Optional[str] = Form(None),
    blood_group: Optional[str] = Form(None),
    blood_pressure: Optional[str] = Form(None),
    body_temperature: Optional[str] = Form(None),
    consultation_type: Optional[str] = Form(None),
    department_id: Optional[str] = Form(None),
    staff_id: Optional[str] = Form(None),
    appointment_type: Optional[str] = Form(None),
    admission_date: Optional[str] = Form(None),
    room_number: Optional[str] = Form(None),
    test_report_details: Optional[str] = Form(None),
    casualty_status: Optional[str] = Form(None),
    reason_for_visit: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
):
    def safe_str_update(value: Optional[str]):
        if value is None or value.strip() == "":
            return None
        return value

    def parse_optional_int(value: Optional[str]):
        try:
            return int(value)
        except (TypeError, ValueError):
            return None

    def parse_optional_float(value: Optional[str]):
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    try:
        patient = await run_in_threadpool(Patient.objects.get, patient_unique_id=patient_id)

        # --- Foreign keys ---
        dept_id = parse_optional_int(department_id)
        staff_id_val = parse_optional_int(staff_id)
        if dept_id:
            patient.department = await run_in_threadpool(Department.objects.get, id=dept_id)
        if staff_id_val:
            patient.staff = await run_in_threadpool(Staff.objects.get, id=staff_id_val)

        # --- Dates ---
        for field_name, date_str in [
            ("date_of_birth", date_of_birth),
            ("admission_date", admission_date),
            ("date_of_registration", date_of_registration),
        ]:
            if date_str and parse_date(date_str):
                setattr(patient, field_name, parse_date(date_str))

        # --- Numeric fields ---
        numeric_fields = {
            "age": age,
            "weight_in_kg": weight_in_kg,
            "height_in_cm": height_in_cm,
            "body_temperature": body_temperature,
        }
        for field, value in numeric_fields.items():
            if value is not None and value.strip() != "":
                if field == "age":
                    setattr(patient, field, parse_optional_int(value))
                else:
                    setattr(patient, field, parse_optional_float(value))

        # --- Other string fields ---
        other_fields = {
            "full_name": full_name,
            "gender": gender,
            "marital_status": marital_status,
            "address": address,
            "phone_number": phone_number,
            "email_address": email_address,
            "national_id": national_id,
            "city": city,
            "country": country,
            "occupation": occupation,
            "blood_group": blood_group,
            "blood_pressure": blood_pressure,
            "consultation_type": consultation_type,
            "appointment_type": appointment_type,
            "room_number": room_number,
            "test_report_details": test_report_details,
            "casualty_status": casualty_status,
            "reason_for_visit": reason_for_visit,
        }
        for field, value in other_fields.items():
            safe_value = safe_str_update(value)
            if safe_value is not None:
                setattr(patient, field, safe_value)

        # --- Photo ---
        if isinstance(photo, UploadFile):
            filename = f"{patient.patient_unique_id}_{photo.filename}"
            file_path = os.path.join(PHOTO_DIR, filename)
            content = await photo.read()
            with open(file_path, "wb") as f:
                f.write(content)
            patient.photo = file_path.replace("\\", "/")

        # --- Save ---
        await run_in_threadpool(patient.save)

        return JSONResponse(
            content={
                "success": True,
                "message": "✅ Patient updated successfully",
                "patient_id": patient.patient_unique_id,
            }
        )
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Update failed: {str(e)}")

# ---------- List Patients ----------
@router.get("/edit")
async def list_patients():
    try:
        patients = await run_in_threadpool(lambda: list(Patient.objects.all().values()))
        return {"patients": patients}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# --------------------------------------------------------------
# 1. DIAGNOSES (LabReport → Diagnosis tab) – UPDATED
# --------------------------------------------------------------
@router.get("/{patient_id}/diagnoses/", response_model=List[dict])
def get_patient_diagnoses(patient_id: int):
    """
    Returns every LabReport for the patient.
    Used by the "Diagnosis" tab.
    """
    try:
        reports = LabReport.objects.filter(patient__id=patient_id).values(
            "test_type",
            "created_at",
            "status",
            "department",  # ← ADDED
        )

        return [
            {
                "reportType": r["test_type"],
                "date": r["created_at"].strftime("%d %b %Y") if r["created_at"] else "—",
                "department": r["department"] or "General",  # ← NEW FIELD
                "status": r["status"].capitalize() if r["status"] else "Pending",
            }
            for r in reports
        ]

    except Exception as e:
        import traceback
        print("DIAGNOSES ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------------------
# 2. PRESCRIPTIONS
# --------------------------------------------------------------
@router.get("/{patient_id}/prescriptions/", response_model=List[dict])
def get_patient_prescriptions(patient_id: int):
    try:
        allocs = MedicineAllocation.objects.filter(patient__id=patient_id).values(
            "allocation_date", "medicine_name", "dosage", "quantity", "frequency", "time"
        )
        return [
            {
                "date": a["allocation_date"].strftime("%d %b %Y") if a["allocation_date"] else "—",
                "prescription": a["medicine_name"],
                "dosage": f"{a['dosage']} {a['quantity'] or ''}".strip(),
                "timing": f"{a['frequency'] or ''} {a['time'] or ''}".strip(),
                "status": "Completed",
            }
            for a in allocs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------------------
# 3. TEST REPORTS (UNIFIED)
# --------------------------------------------------------------
@router.get("/{patient_id}/test-reports/", response_model=List[dict])
def get_patient_test_reports(patient_id: int):
    try:
        reports = LabReport.objects.filter(patient__id=patient_id).values(
            "id", "test_type", "department", "status", "created_at"
        )
        lab_dict = {r["id"]: r for r in reports}

        # Get referenced IDs from allocations
        referenced = set()
        for alloc in MedicineAllocation.objects.filter(patient__id=patient_id).values("lab_report_ids"):
            if alloc["lab_report_ids"]:
                ids = [int(x) for x in alloc["lab_report_ids"].split(",") if x.strip()]
                referenced.update(ids)

        result = []
        for r in reports:
            source = "Medicine Allocation" if r["id"] in referenced else "Independent"
            result.append({
                "source": source,
                "dateTime": r["created_at"].strftime("%Y-%m-%d %I:%M %p") if r["created_at"] else "—",
                "month": r["created_at"].strftime("%B") if r["created_at"] else "—",
                "testType": r["test_type"],
                "department": r["department"] or "General",
                "status": r["status"].capitalize(),
            })
        result.sort(key=lambda x: x["dateTime"], reverse=True)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/departments/", response_model=List[str])
def get_departments():
    """
    Returns unique department names from LabReport.
    Used by Test Reports dropdown.
    """
    try:
        depts = (
            LabReport.objects
            .filter(department__isnull=False)
            .values_list("department", flat=True)
            .distinct()
        )
        # Always include "All" for UI
        return ["All"] + sorted(set(depts))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Add this to your router file (e.g., routers/medicine_allocation.py or a new stock router)

@router.get("/available-medicines/")
async def get_available_medicines():
    """
    Returns list of available medicines with their possible dosages and item_code
    Used for dynamic dropdown in Medicine Allocation
    """
    try:
        medicines = Stock.objects.filter(
            status='available', 
            quantity__gt=0
        ).values(
            'product_name', 'dosage', 'item_code', 'unit_price'
        ).distinct()

        # Group by product_name and collect unique dosages
        medicine_map = {}
        for med in medicines:
            name = med['product_name']
            dosage = med['dosage'] or "Not Specified"
            if name not in medicine_map:
                medicine_map[name] = {
                    "name": name,
                    "item_code": med['item_code'],
                    "unit_price": str(med['unit_price']),
                    "dosages": set()
                }
            if dosage:
                medicine_map[name]["dosages"].add(dosage)

        # Convert sets to sorted lists
        result = []
        for name, data in medicine_map.items():
            result.append({
                "name": data["name"],
                "item_code": data["item_code"],
                "unit_price": data["unit_price"],
                "dosages": sorted(list(data["dosages"]))  # e.g., ["250mg", "500mg"]
            })

        # Sort by name
        result.sort(key=lambda x: x["name"].lower())
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/available/")
def get_available_stock():
    stock = Stock.objects.filter(
        status="available", quantity__gt=0
    ).values(
        "id", "product_name", "dosage", "quantity", "batch_number", "item_code"
    )
    return list(stock)