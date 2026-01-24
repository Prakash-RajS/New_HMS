# fastapi_app/routers/dashboard.py
from fastapi import APIRouter, HTTPException
from django.db.models import Count, Q, Sum
from django.db import models
from datetime import datetime, timedelta
from django.utils import timezone
from datetime import datetime, timedelta, time

import json
from asgiref.sync import sync_to_async
import asyncio

from HMS_backend.models import (
    Patient, Staff, Appointment, Department, 
    LabReport, Bed, BedGroup, HospitalInvoiceHistory,
    MedicineAllocation, Dispatch, Trip, Stock, BloodGroup, Surgery
)

from django.db import close_old_connections, connection

# ------------------- Database Health Check -------------------
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

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Async wrappers for Django ORM calls
@sync_to_async
def get_patient_count():
    ensure_db_connection()
    return Patient.objects.count()

@sync_to_async
def get_active_patients():
    ensure_db_connection()
    return Patient.objects.filter(
        admission_date__isnull=False,
        discharge_date__isnull=True
    ).count()

@sync_to_async
def get_weekly_admissions(week_ago):
    ensure_db_connection()
    return Patient.objects.filter(created_at__date__gte=week_ago).count()

@sync_to_async
def get_today_admissions(today):
    ensure_db_connection()
    return Patient.objects.filter(created_at__date=today).count()

@sync_to_async
def get_priority_care():
    ensure_db_connection()
    return Appointment.objects.filter(status='severe').count()

@sync_to_async
def get_appointment_count():
    ensure_db_connection()
    return Appointment.objects.count()

@sync_to_async
def get_today_appointments(today):
    ensure_db_connection()
    return Appointment.objects.filter(created_at__date=today).count()

@sync_to_async
def get_emergency_cases():
    ensure_db_connection()
    return Appointment.objects.filter(appointment_type='emergency').count()

@sync_to_async
def get_department_stats():
    ensure_db_connection()
    return list(Appointment.objects.values('department__name').annotate(count=Count('id')).order_by('-count'))

@sync_to_async
def get_total_revenue():
    ensure_db_connection()
    result = HospitalInvoiceHistory.objects.aggregate(total=Sum('amount'))
    return float(result['total'] or 0)

@sync_to_async
def get_today_revenue(today):
    ensure_db_connection()
    result = HospitalInvoiceHistory.objects.filter(date=today).aggregate(total=Sum('amount'))
    return float(result['total'] or 0)

@sync_to_async
def get_outstanding_payments():
    ensure_db_connection()
    result = HospitalInvoiceHistory.objects.filter(status__in=['Unpaid', 'Pending']).aggregate(total=Sum('amount'))
    return float(result['total'] or 0)

# Safe pharmacy revenue function (handles missing table)
@sync_to_async
def get_pharmacy_revenue_today(today):
    ensure_db_connection()
    try:
        # Check if PharmacyInvoiceHistory model exists and table is created
        from HMS_backend.models import PharmacyInvoiceHistory
        result = PharmacyInvoiceHistory.objects.filter(bill_date=today).aggregate(total=Sum('net_amount'))
        return float(result['total'] or 0)
    except Exception:
        return 0.0

@sync_to_async
def get_recent_patients():
    ensure_db_connection()
    return list(Patient.objects.order_by('-created_at')[:5].values('id', 'full_name', 'created_at'))

@sync_to_async
def get_recent_appointments():
    ensure_db_connection()
    return list(Appointment.objects.order_by('-created_at')[:5].values('id', 'patient_name', 'created_at'))

@sync_to_async
def get_emergency_appointments():
    ensure_db_connection()
    return Appointment.objects.filter(appointment_type='emergency').count()

@sync_to_async
def get_patients_with_admission():
    ensure_db_connection()
    return Patient.objects.filter(admission_date__isnull=False).count()

@sync_to_async
def get_total_invoices():
    ensure_db_connection()
    return HospitalInvoiceHistory.objects.count()

def normalize_timestamp(ts):
    """
    Ensures timestamp is timezone-aware datetime
    """
    if isinstance(ts, str):
        return datetime.fromisoformat(ts)

    if isinstance(ts, datetime):
        if ts.tzinfo is None:
            return timezone.make_aware(ts)
        return ts

    return timezone.now()

from django.utils import timezone
from datetime import timedelta

@sync_to_async
def get_total_surgeries():
    ensure_db_connection()
    now = timezone.now()

    # First day of current month
    start_of_month = now.replace(
        day=1, hour=0, minute=0, second=0, microsecond=0
    )

    # First day of next month
    if now.month == 12:
        start_of_next_month = start_of_month.replace(
            year=now.year + 1, month=1
        )
    else:
        start_of_next_month = start_of_month.replace(
            month=now.month + 1
        )

    return Surgery.objects.filter(
        scheduled_date__gte=start_of_month,
        scheduled_date__lt=start_of_next_month
    ).count()


@sync_to_async
def get_today_surgeries():
    ensure_db_connection()
    today = timezone.localdate()

    start = datetime.combine(today, time.min)
    end = datetime.combine(today, time.max)

    start = timezone.make_aware(start)
    end = timezone.make_aware(end)

    return Surgery.objects.filter(
        scheduled_date__range=(start, end)
    ).count()

# @sync_to_async
# def get_pending_surgeries():
#     return Surgery.objects.filter(status="pending").count()

@sync_to_async
def get_success_rate():
    ensure_db_connection()
    today = timezone.now()
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    success_count = Surgery.objects.filter(
        created_at__gte=start_of_month,
        status="success"
    ).count()

    failed_count = Surgery.objects.filter(
        created_at__gte=start_of_month,
        status="failed"
    ).count()

    total_completed = success_count + failed_count

    if total_completed == 0:
        return 0

    return round((success_count / total_completed) * 100, 1)

    
@sync_to_async
def get_emergency_surgeries():
    ensure_db_connection()
    emergency_patient_ids = Appointment.objects.filter(
        appointment_type="emergency"
    ).values_list("patient_id", flat=True)

    return Surgery.objects.filter(
        patient_id__in=emergency_patient_ids
    ).count()



@router.get("/stats")
async def get_dashboard_stats():
    """Get all dashboard statistics"""
    try:
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        
        # Get all data asynchronously
        total_patients = await get_patient_count()
        
        # If no patients exist, return zeros
        if total_patients == 0:
            return {
                "patient_stats": {
                    "total_patients": 0,
                    "active_patients": 0,
                    "weekly_admissions": 0,
                    "priority_care": 0,
                    "today_admissions": 0
                },
                "appointment_stats": {
                    "total_appointments": 0,
                    "today_appointments": 0,
                    "emergency_cases": 0,
                    "consultation_today": 0
                },
                "financial_stats": {
                    "total_revenue": 0.0,
                    "today_revenue": 0.0,
                    "pharmacy_revenue_today": 0.0,
                    "outstanding_payments": 0.0
                },
                "department_distribution": [],
                "timestamp": datetime.now().isoformat(),
                "data_status": "NO_DATA"
            }
        
        # Get all statistics concurrently
        active_patients, weekly_admissions, today_admissions, priority_care = await asyncio.gather(
            get_active_patients(),
            get_weekly_admissions(week_ago),
            get_today_admissions(today),
            get_priority_care()
        )
        
        total_appointments, today_appointments, emergency_cases, department_stats = await asyncio.gather(
            get_appointment_count(),
            get_today_appointments(today),
            get_emergency_cases(),
            get_department_stats()
        )
        
        total_revenue, today_revenue, pharmacy_revenue_today, outstanding_payments = await asyncio.gather(
            get_total_revenue(),
            get_today_revenue(today),
            get_pharmacy_revenue_today(today),
            get_outstanding_payments()
        )
        total_surgeries, today_surgeries, emergency_surgeries, success_rate = await asyncio.gather(
    get_total_surgeries(),
    get_today_surgeries(),
    get_emergency_surgeries(),
    get_success_rate()
)



        return {
            "patient_stats": {
                "total_patients": total_patients,
                "active_patients": active_patients,
                "weekly_admissions": weekly_admissions,
                "priority_care": priority_care,
                "today_admissions": today_admissions
            },
            "appointment_stats": {
                "total_appointments": total_appointments,
                "today_appointments": today_appointments,
                "emergency_cases": emergency_cases,
                "consultation_today": today_appointments
            },
            "financial_stats": {
                "total_revenue": total_revenue,
                "today_revenue": today_revenue,
                "pharmacy_revenue_today": pharmacy_revenue_today,
                "outstanding_payments": outstanding_payments
            },
            "surgery_stats": {
    "total_surgeries": total_surgeries,
    "today_surgeries": today_surgeries,
    "emergency_surgeries": emergency_surgeries,
    "success_rate": success_rate
},


            "department_distribution": department_stats,
            "timestamp": datetime.now().isoformat(),
            "data_status": "REAL_DATA"
        }
        
    except Exception as e:
        print(f"Dashboard stats error: {str(e)}")
        return {
            "patient_stats": {
                "total_patients": 0,
                "active_patients": 0,
                "weekly_admissions": 0,
                "priority_care": 0,
                "today_admissions": 0
            },
            "appointment_stats": {
                "total_appointments": 0,
                "today_appointments": 0,
                "emergency_cases": 0,
                "consultation_today": 0
            },
            "financial_stats": {
                "total_revenue": 0.0,
                "today_revenue": 0.0,
                "pharmacy_revenue_today": 0.0,
                "outstanding_payments": 0.0
            },
            "department_distribution": [],
            "timestamp": datetime.now().isoformat(),
            "data_status": "ERROR",
            "error": str(e)
        }


@router.get("/recent-activities")
async def get_recent_activities():
    try:
        recent_activities = []

        # Recent patients
        recent_patients = await get_recent_patients()
        for patient in recent_patients[:3]:
            recent_activities.append({
                "id": f"patient_{patient['id']}",
                "type": "info",
                "message": f"New patient registered: {patient['full_name']}",
                "timestamp": patient["created_at"],
                "read": False,
                "category": "patient"
            })

        # Recent appointments
        recent_appointments = await get_recent_appointments()
        for appointment in recent_appointments[:3]:
            recent_activities.append({
                "id": f"appointment_{appointment['id']}",
                "type": "info",
                "message": f"New appointment: {appointment['patient_name']}",
                "timestamp": appointment["created_at"],
                "read": False,
                "category": "appointment"
            })

        # Emergency alert
        emergency_count = await get_emergency_appointments()
        if emergency_count > 0:
            recent_activities.append({
                "id": "emergency_alert",
                "type": "error",
                "message": f"{emergency_count} emergency case(s) require attention",
                "timestamp": timezone.now(),
                "read": False,
                "category": "emergency"
            })

        # Normalize timestamps
        for activity in recent_activities:
            activity["timestamp"] = normalize_timestamp(activity["timestamp"])

        # Sort latest first
        recent_activities.sort(key=lambda x: x["timestamp"], reverse=True)

        # Convert to ISO for frontend
        for activity in recent_activities:
            activity["timestamp"] = activity["timestamp"].isoformat()

        return recent_activities[:10]

    except Exception as e:
        print(f"Recent activities error: {e}")
        return []


@router.get("/debug-data")
async def debug_data():
    """Debug endpoint to see actual data counts"""
    try:
        # Get all debug data asynchronously
        total_patients, total_appointments, total_invoices = await asyncio.gather(
            get_patient_count(),
            get_appointment_count(),
            get_total_invoices()
        )
        
        recent_patients, recent_appointments = await asyncio.gather(
            get_recent_patients(),
            get_recent_appointments()
        )
        
        patients_with_admission, emergency_appointments = await asyncio.gather(
            get_patients_with_admission(),
            get_emergency_appointments()
        )
        
        return {
            "total_patients": total_patients,
            "total_appointments": total_appointments,
            "total_invoices": total_invoices,
            "recent_patients": recent_patients,
            "recent_appointments": recent_appointments,
            "patient_with_admission": patients_with_admission,
            "emergency_appointments": emergency_appointments
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/diagnostic")
async def diagnostic_check():
    """Comprehensive diagnostic of all data"""
    try:
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        
        # Get all diagnostic data
        total_patients = await get_patient_count()
        patients_with_admission = await get_patients_with_admission()
        active_patients = await get_active_patients()
        weekly_admissions = await get_weekly_admissions(week_ago)
        today_admissions = await get_today_admissions(today)
        
        total_appointments = await get_appointment_count()
        today_appointments = await get_today_appointments(today)
        emergency_appointments = await get_emergency_appointments()
        
        recent_patients = await get_recent_patients()
        recent_appointments = await get_recent_appointments()
        
        diagnostic_data = {
            "database_status": "Connected",
            "current_time": datetime.now().isoformat(),
            
            # Patient diagnostics
            "patients": {
                "total": total_patients,
                "with_admission_date": patients_with_admission,
                "without_discharge": active_patients,
                "recent_7_days": weekly_admissions,
                "today": today_admissions,
                "sample_data": recent_patients
            },
            
            # Appointment diagnostics
            "appointments": {
                "total": total_appointments,
                "emergency": emergency_appointments,
                "today": today_appointments,
                "sample_data": recent_appointments
            },
            
            # Check if we have any data at all
            "has_data": total_patients > 0 or total_appointments > 0
        }
        
        return diagnostic_data
        
    except Exception as e:
        return {"database_status": "Error", "error": str(e)}

@router.get("/test-connection")
async def test_connection():
    """Test endpoint to verify dashboard is working"""
    return {
        "status": "success",
        "message": "Dashboard API is working",
        "timestamp": datetime.now().isoformat()
    }

@router.post("/create-sample-data")
async def create_sample_data():
    """Create sample data for testing"""
    try:
        from django.utils import timezone
        from datetime import date
        
        # Get or create department
        department = await sync_to_async(lambda: (ensure_db_connection(), Department.objects.first())[1])()
        if not department:
            department = await sync_to_async(lambda: (ensure_db_connection(), Department.objects.create(
                name="General Medicine",
                status="active"
            ))[1])()
        
        # Get or create staff
        staff = await sync_to_async(lambda: (ensure_db_connection(), Staff.objects.first())[1])()
        if not staff:
            staff = await sync_to_async(lambda: (ensure_db_connection(), Staff.objects.create(
                full_name="Dr. Test Doctor",
                phone="1234567890",
                email="doctor@test.com",
                designation="Doctor",
                department=department
            ))[1])()
        
        # Create sample patient with admission
        patient = await sync_to_async(lambda: (ensure_db_connection(), Patient.objects.create(
            full_name="Test Emergency Patient",
            admission_date=date.today(),
            phone_number="9876543210",
            patient_unique_id="PAT_TEST001",
            created_at=timezone.now()
        ))[1])()
        
        # Create emergency appointment
        appointment = await sync_to_async(lambda: (ensure_db_connection(), Appointment.objects.create(
            patient_name="Test Emergency Patient",
            department=department,
            staff=staff,
            room_no="ER-101",
            phone_no="9876543210",
            appointment_type="emergency",
            status="severe"
        ))[1])()
        
        # Create sample invoice
        invoice = await sync_to_async(lambda: (ensure_db_connection(), HospitalInvoiceHistory.objects.create(
            date=date.today(),
            patient_name="Test Emergency Patient",
            patient_id="PAT_TEST001",
            department=department.name,
            amount=2500.00,
            payment_method="Cash",
            status="Paid"
        ))[1])()
        
        return {
            "status": "success",
            "message": "Sample emergency data created",
            "patient_id": patient.id,
            "appointment_id": appointment.id,
            "invoice_id": invoice.id
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}