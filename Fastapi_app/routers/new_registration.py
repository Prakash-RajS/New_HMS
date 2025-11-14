import os
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query, Path
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

from HMS_backend import models
from HMS_backend.models import Patient, Department, Staff
from django.db.models import Q, F  # ← ADDED F

router = APIRouter(prefix="/patients", tags=["Patients"])

PHOTO_DIR = "fastapi_app/Patient_photos"
os.makedirs(PHOTO_DIR, exist_ok=True)

# Base URL for static files
BASE_URL = "http://localhost:8000"  # Change in production

def parse_date(date_str: Optional[str]):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception:
        return None

def parse_optional_int(v):
    return int(v) if v and str(v).strip() else None

def parse_optional_float(v):
    return float(v) if v and str(v).strip() else None


# ---------- 1. GET Departments ----------
@router.get("/departments")
async def get_departments():
    depts = await run_in_threadpool(
        lambda: list(
            Department.objects.filter(status="active")
            .values("id", "name")
            .order_by("name")
        )
    )
    return {"departments": depts}


# ---------- 2. GET Staff ----------
@router.get("/staff")
async def get_staff(department_id: int = Query(...)):
    if department_id <= 0:
        raise HTTPException(400, "department_id required")
    await run_in_threadpool(Department.objects.get, id=department_id, status="active")
    staff = await run_in_threadpool(
        lambda: list(
            Staff.objects.filter(department_id=department_id, status="active")
            .values("id", "full_name", "designation")
            .order_by("full_name")
        )
    )
    return {"staff": staff}


# ---------- 3. POST Register Patient ----------
@router.post("/register")
async def register_patient(
    full_name: str = Form(...),
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
    department_id: str = Form(...),
    staff_id: str = Form(...),
    appointment_type: Optional[str] = Form(None),
    admission_date: Optional[str] = Form(None),
    room_number: Optional[str] = Form(None),
    test_report_details: Optional[str] = Form(None),
    casualty_status: Optional[str] = Form(None),
    reason_for_visit: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
):
    dept_id = parse_optional_int(department_id)
    staff_db_id = parse_optional_int(staff_id)
    if not dept_id or not staff_db_id:
        raise HTTPException(400, "Invalid department_id or staff_id")

    department = await run_in_threadpool(Department.objects.get, id=dept_id)
    staff = await run_in_threadpool(Staff.objects.get, id=staff_db_id)

    patient = await run_in_threadpool(
        Patient.objects.create,
        full_name=full_name,
        date_of_birth=parse_date(date_of_birth),
        gender=gender,
        age=parse_optional_int(age),
        marital_status=marital_status,
        address=address,
        phone_number=phone_number,
        email_address=email_address,
        national_id=national_id,
        city=city,
        country=country,
        date_of_registration=parse_date(date_of_registration),
        occupation=occupation,
        weight_in_kg=parse_optional_float(weight_in_kg),
        height_in_cm=parse_optional_float(height_in_cm),
        blood_group=blood_group,
        blood_pressure=blood_pressure,
        body_temperature=parse_optional_float(body_temperature),
        consultation_type=consultation_type,
        department=department,
        staff=staff,
        appointment_type=appointment_type,
        admission_date=parse_date(admission_date),
        room_number=room_number,
        test_report_details=test_report_details,
        casualty_status=(casualty_status or "Active").strip().title(),
        reason_for_visit=reason_for_visit,
    )

    if photo and photo.filename:
        filename = f"{patient.patient_unique_id}_{photo.filename}"
        path = os.path.join(PHOTO_DIR, filename)
        with open(path, "wb") as f:
            f.write(await photo.read())
        patient.photo = path.replace("\\", "/")
        await run_in_threadpool(patient.save)

    return JSONResponse({
        "success": True,
        "patient_id": patient.patient_unique_id,
        "message": "Patient registered"
    })


# ---------- 4. GET List All Patients (IPD) ----------
@router.get("/", response_model=dict)
async def list_patients(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=200)
):
    try:
        query = Patient.objects.all().order_by("-created_at")
        if search:
            query = query.filter(
                Q(full_name__icontains=search) |
                Q(phone_number__icontains=search) |
                Q(patient_unique_id__icontains=search)
            )

        total = await run_in_threadpool(query.count)
        patients = await run_in_threadpool(
            lambda: list(
                query[(page - 1) * limit : page * limit].values(
                    "id",
                    "patient_unique_id",
                    "full_name",
                    "date_of_registration",
                    "department__name",      # ← NOW INCLUDED
                    "staff__full_name",      # ← NOW INCLUDED
                    "room_number",
                    "appointment_type",
                    "casualty_status",
                    "photo",
                    "created_at",
                )
            )
        )

        for p in patients:
            cs = (p.get("casualty_status") or "").strip().lower()
            p["discharge"] = "Done" if cs in ["completed", "discharged"] else "Pending"
            photo = p.get("photo")
            p["photo_url"] = (
                f"{BASE_URL}/static/patient_photos/{os.path.basename(photo)}"
                if photo else None
            )

        return {
            "patients": patients,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    except Exception as e:
        logging.exception("list_patients error")
        raise HTTPException(500, detail=str(e))


# ---------- 4.1 GET OPD ----------
@router.get("/opd")
async def list_opd(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=200)
):
    try:
        qs = Patient.objects.filter(
            Q(casualty_status__iexact="Completed") |
            Q(casualty_status__iexact="Discharged")
        ).order_by("-created_at")

        if search:
            qs = qs.filter(
                Q(full_name__icontains=search) |
                Q(patient_unique_id__icontains=search)
            )

        total = await run_in_threadpool(qs.count)
        start = (page - 1) * limit
        patients = await run_in_threadpool(
            lambda: list(
                qs[start:start + limit].values(
                    "id",
                    "patient_unique_id",
                    "full_name",
                    "date_of_registration",
                    "department__name",      # ← NOW INCLUDED
                    "staff__full_name",      # ← NOW INCLUDED
                    "room_number",
                    "appointment_type",
                    "casualty_status",
                    "photo"
                )
            )
        )

        for p in patients:
            p["discharge"] = "Done"
            photo = p.get("photo")
            p["photo_url"] = (
                f"{BASE_URL}/static/patient_photos/{os.path.basename(photo)}"
                if photo else None
            )

        return {
            "patients": patients,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit,
        }

    except Exception as e:
        logging.exception("list_opd error: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to fetch OPD patients: {str(e)}")


# ---------- 5. GET One Patient (BY ID OR PATxxxx) ----------
@router.get("/{patient_id}")
async def get_patient(patient_id: str = Path(...)):
    try:
        # Accept both Django PK (int) and patient_unique_id (str)
        if patient_id.isdigit():
            p = await run_in_threadpool(
                lambda: Patient.objects.select_related("department", "staff")
                    .filter(id=int(patient_id))
                    .annotate(
                        department__name=F("department__name"),
                        staff__full_name=F("staff__full_name")
                    )
                    .values(
                        "id",
                        "patient_unique_id", "full_name", "date_of_birth", "gender", "age",
                        "marital_status", "address", "phone_number", "email_address",
                        "national_id", "city", "country", "date_of_registration",
                        "occupation", "weight_in_kg", "height_in_cm", "blood_group",
                        "blood_pressure", "body_temperature", "consultation_type",
                        "department_id", "staff_id", "appointment_type", "admission_date",
                        "room_number", "test_report_details", "casualty_status",
                        "reason_for_visit", "photo", "created_at",
                        "department__name", "staff__full_name"  # ← NOW RETURNED
                    ).first()
            )
        else:
            p = await run_in_threadpool(
                lambda: Patient.objects.select_related("department", "staff")
                    .filter(patient_unique_id=patient_id)
                    .annotate(
                        department__name=F("department__name"),
                        staff__full_name=F("staff__full_name")
                    )
                    .values(
                        "id",
                        "patient_unique_id", "full_name", "date_of_birth", "gender", "age",
                        "marital_status", "address", "phone_number", "email_address",
                        "national_id", "city", "country", "date_of_registration",
                        "occupation", "weight_in_kg", "height_in_cm", "blood_group",
                        "blood_pressure", "body_temperature", "consultation_type",
                        "department_id", "staff_id", "appointment_type", "admission_date",
                        "room_number", "test_report_details", "casualty_status",
                        "reason_for_visit", "photo", "created_at",
                        "department__name", "staff__full_name"  # ← NOW RETURNED
                    ).first()
            )

        if not p:
            raise HTTPException(404, "Patient not found")

        # Format dates
        for f in ["date_of_birth", "date_of_registration", "admission_date"]:
            if p.get(f):
                d = p[f]
                if isinstance(d, datetime):
                    p[f] = d.strftime("%m/%d/%Y")
                else:
                    p[f] = f"{d.month:02d}/{d.day:02d}/{d.year}"

        photo = p.get("photo")
        p["photo_url"] = (
            f"{BASE_URL}/static/patient_photos/{os.path.basename(photo)}"
            if photo else None
        )
        cs = (p.get("casualty_status") or "").strip().lower()
        p["discharge"] = "Done" if cs in ["completed", "discharged"] else "Pending"
        return p
    except Exception as e:
        logging.exception("get_patient error")
        raise HTTPException(500, detail=str(e))


# ---------- 6. PUT Edit Patient ----------
@router.put("/{patient_id}")
async def edit_patient(
    patient_id: str = Path(...),
    full_name: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    appointment_type: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    date_of_registration: Optional[str] = Form(None),
    department_id: Optional[str] = Form(None),
    staff_id: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None),
):
    try:
        patient = await run_in_threadpool(Patient.objects.get, patient_unique_id=patient_id)

        if full_name is not None and full_name.strip():
            patient.full_name = full_name.strip()
        if phone_number is not None and phone_number.strip():
            patient.phone_number = phone_number.strip()
        if appointment_type is not None and appointment_type.strip():
            patient.appointment_type = appointment_type.strip()

        if status is not None:
            cleaned = status.strip()
            if cleaned:
                normalized_status = cleaned.title()
                patient.casualty_status = normalized_status
                if normalized_status in ["Completed", "Discharged"]:
                    patient.consultation_type = "Out-patient"

        if date_of_registration:
            parsed = parse_date(date_of_registration)
            if parsed:
                patient.date_of_registration = parsed

        dept_id = parse_optional_int(department_id)
        staff_db_id = parse_optional_int(staff_id)
        if dept_id:
            department = await run_in_threadpool(Department.objects.get, id=dept_id)
            patient.department = department
        if staff_db_id:
            staff = await run_in_threadpool(Staff.objects.get, id=staff_db_id)
            patient.staff = staff

        if photo and photo.filename:
            filename = f"{patient.patient_unique_id}_{photo.filename}"
            path = os.path.join(PHOTO_DIR, filename)
            with open(path, "wb") as f:
                f.write(await photo.read())
            patient.photo = path.replace("\\", "/")

        await run_in_threadpool(patient.save)
        return JSONResponse({"success": True, "message": "Updated"})
    except Patient.DoesNotExist:
        raise HTTPException(404, "Patient not found")
    except Exception as e:
        logging.exception("edit_patient error")
        raise HTTPException(400, detail=str(e))


# ---------- 7. DELETE Patient ----------
@router.delete("/{patient_id}")
async def delete_patient(patient_id: str = Path(...)):
    try:
        # Fetch patient
        patient = await run_in_threadpool(Patient.objects.get, patient_unique_id=patient_id)
        
        # Store photo path
        photo_path = getattr(patient, "photo", None)
        
        # Delete patient
        await run_in_threadpool(patient.delete)
        
        # Delete photo if exists
        if photo_path and isinstance(photo_path, str) and os.path.exists(photo_path):
            try:
                os.remove(photo_path)
            except Exception as file_err:
                logging.warning(f"Failed to delete photo {photo_path}: {file_err}")
        
        return {"success": True, "message": "Deleted"}
    
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found")
    except Exception as e:
        logging.exception("delete_patient error")
        raise HTTPException(status_code=500, detail=str(e))


