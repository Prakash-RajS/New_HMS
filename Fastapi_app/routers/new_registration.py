import os
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional
from HMS_backend.models import Patient, Department, Staff
from starlette.concurrency import run_in_threadpool

router = APIRouter(prefix="/patients", tags=["Patients"])

PHOTO_DIR = "fastapi_app/Patient_photos"
os.makedirs(PHOTO_DIR, exist_ok=True)


# ---------- Helper to Parse Date ----------
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


# ---------- Register Patient ----------
@router.post("/register")
async def register_patient(
    full_name: str = Form(...),
    date_of_birth: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    marital_status: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    email_address: Optional[str] = Form(None),
    national_id: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    country: Optional[str] = Form(None),
    date_of_registration: Optional[str] = Form(None),
    occupation: Optional[str] = Form(None),
    weight_in_kg: Optional[float] = Form(None),
    height_in_cm: Optional[float] = Form(None),
    blood_group: Optional[str] = Form(None),
    blood_pressure: Optional[str] = Form(None),
    body_temperature: Optional[float] = Form(None),
    consultation_type: Optional[str] = Form(None),
    department_id: int = Form(...),
    staff_id: int = Form(...),
    appointment_type: Optional[str] = Form(None),
    admission_date: Optional[str] = Form(None),
    room_number: Optional[str] = Form(None),
    test_report_details: Optional[str] = Form(None),
    casualty_status: Optional[str] = Form(None),
    reason_for_visit: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
):
    try:
        department = await run_in_threadpool(Department.objects.get, id=department_id)
        staff = await run_in_threadpool(Staff.objects.get, id=staff_id)

        patient = await run_in_threadpool(
            Patient.objects.create,
            full_name=full_name,
            date_of_birth=parse_date(date_of_birth),
            gender=gender,
            age=age,
            marital_status=marital_status,
            address=address,
            phone_number=phone_number,
            email_address=email_address,
            national_id=national_id,
            city=city,
            country=country,
            date_of_registration=parse_date(date_of_registration),
            occupation=occupation,
            weight_in_kg=weight_in_kg,
            height_in_cm=height_in_cm,
            blood_group=blood_group,
            blood_pressure=blood_pressure,
            body_temperature=body_temperature,
            consultation_type=consultation_type,
            department=department,
            staff=staff,
            appointment_type=appointment_type,
            admission_date=parse_date(admission_date),
            room_number=room_number,
            test_report_details=test_report_details,
            casualty_status=casualty_status,
            reason_for_visit=reason_for_visit,
        )

        # Save patient photo
        if isinstance(photo, UploadFile):
            filename = f"{patient.patient_unique_id}_{photo.filename}"
            file_path = os.path.join(PHOTO_DIR, filename)
            content = await photo.read()
            with open(file_path, "wb") as f:
                f.write(content)
            patient.photo = file_path.replace("\\", "/")
            await run_in_threadpool(patient.save)

        return JSONResponse(
            content={
                "success": True,
                "patient_id": patient.patient_unique_id,
                "full_name": patient.full_name,
            }
        )

    except Department.DoesNotExist:
        raise HTTPException(status_code=404, detail="Department not found")
    except Staff.DoesNotExist:
        raise HTTPException(status_code=404, detail="Staff not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
