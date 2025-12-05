from fastapi import APIRouter, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, ValidationError, EmailStr
from typing import Optional, List
import os, django
from datetime import date
from django.db import IntegrityError
# Django setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HMS_project.settings")
django.setup()
from HMS_backend.models import Donor, BloodGroup
router = APIRouter()
# === Pydantic Schemas ===
class DonorSchema(BaseModel):
    donor_name: str
    gender: str
    blood_type: str
    phone: str
    email: Optional[str] = None
    last_donation_date: Optional[date] = None
    class Config:
        extra = "forbid"
class DonorResponse(BaseModel):
    id: int
    donor_name: str
    gender: str
    blood_type: str
    phone: str
    email: Optional[str]
    last_donation_date: Optional[date]
    status: str
# ---------- Helper function for donor notifications ----------
async def safe_send_donor_notification(notification_type: str, donor_data, old_status=None, new_status=None, units_donated=None, patient_name=None, units_needed=None):
    """Safely send donor notifications with error handling"""
    try:
        print(f"🔔 [DONOR] Starting {notification_type} notification for: {donor_data.donor_name if hasattr(donor_data, 'donor_name') else donor_data.get('donor_name', 'Unknown')}")
       
        from ..routers.notifications import NotificationService
       
        if notification_type == "registered":
            await NotificationService.send_donor_registered(donor_data)
        elif notification_type == "updated":
            await NotificationService.send_donor_updated(donor_data)
        elif notification_type == "deleted":
            await NotificationService.send_donor_deleted(donor_data)
        elif notification_type == "eligibility_changed" and old_status and new_status:
            await NotificationService.send_donor_eligibility_changed(donor_data, old_status, new_status)
        elif notification_type == "donation_received" and units_donated is not None:
            await NotificationService.send_donation_received(donor_data, units_donated)
        elif notification_type == "became_eligible":
            await NotificationService.send_donor_became_eligible(donor_data)
        elif notification_type == "urgent_request" and units_needed:
            await NotificationService.send_urgent_blood_request(donor_data, units_needed, patient_name)
           
        print(f"✅ [DONOR] {notification_type} notification sent successfully")
           
    except ImportError as e:
        print(f"❌ [DONOR] NotificationService not available: {e}")
    except Exception as e:
        print(f"❌ [DONOR] Failed to send {notification_type} notification: {e}")
# === ADD DONOR ===
@router.post("/api/donors/add", response_model=DonorResponse)
async def add_donor(request: Request):
    body = await request.json()
    try:
        data = DonorSchema(**body)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())
    def create_donor():
        try:
            from django.db import transaction
           
            with transaction.atomic():
                # Check for duplicate phone
                if Donor.objects.filter(phone=data.phone).exists():
                    return {"error": "PHONE_EXISTS"}
               
                # Check for duplicate email if provided
                if data.email and Donor.objects.filter(email=data.email).exists():
                    return {"error": "EMAIL_EXISTS"}
               
                donor = Donor.objects.create(
                    donor_name=data.donor_name,
                    gender=data.gender,
                    blood_type=data.blood_type,
                    phone=data.phone,
                    email=data.email if data.email else None,
                    last_donation_date=data.last_donation_date,
                )
               
                # Check eligibility (will set status based on dates)
                donor.check_eligibility()
                return donor
               
        except IntegrityError as e:
            if "phone" in str(e).lower():
                return {"error": "PHONE_EXISTS"}
            elif "email" in str(e).lower():
                return {"error": "EMAIL_EXISTS"}
            return {"error": "DATABASE_ERROR"}
        except Exception as e:
            if "is not a valid choice" in str(e):
                field = (
                    "blood_type" if "blood_type" in str(e) else
                    "gender" if "gender" in str(e) else
                    "status"
                )
                return {"error": f"INVALID_CHOICE:{field}"}
            return {"error": "SAVE_FAILED"}
    try:
        result = await run_in_threadpool(create_donor)
       
        if isinstance(result, dict) and "error" in result:
            error_msg = result["error"]
            if error_msg == "PHONE_EXISTS":
                raise HTTPException(
                    status_code=400,
                    detail="Phone number already exists. Please use a unique phone."
                )
            elif error_msg == "EMAIL_EXISTS":
                raise HTTPException(
                    status_code=400,
                    detail="Email already exists. Please use a unique email."
                )
            elif error_msg == "DATABASE_ERROR":
                raise HTTPException(status_code=400, detail="Database constraint violated.")
            elif error_msg.startswith("INVALID_CHOICE:"):
                field = error_msg.split(":")[1]
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value for {field}. Please select from allowed options."
                )
            elif error_msg == "SAVE_FAILED":
                raise HTTPException(status_code=500, detail="Failed to save donor.")
            else:
                raise HTTPException(status_code=500, detail="Unknown error occurred.")
       
        # Success - send notification
        donor = result
        await safe_send_donor_notification("registered", donor)
       
        return DonorResponse(
            id=donor.id,
            donor_name=donor.donor_name,
            gender=donor.gender,
            blood_type=donor.blood_type,
            phone=donor.phone,
            email=donor.email,
            last_donation_date=donor.last_donation_date,
            status=donor.status,
        )
       
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in add_donor: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
# === FETCH DONORS ===
@router.get("/api/donors/list", response_model=List[DonorResponse])
async def fetch_donors():
    def get_all():
        donors = Donor.objects.all()
        # Check eligibility for all donors before returning
        for donor in donors:
            donor.check_eligibility()
       
        return [
            DonorResponse(
                id=d.id,
                donor_name=d.donor_name,
                gender=d.gender,
                blood_type=d.blood_type,
                phone=d.phone,
                email=d.email,
                last_donation_date=d.last_donation_date,
                status=d.status,
            )
            for d in donors
        ]
    return await run_in_threadpool(get_all)
# === GET SINGLE DONOR ===
@router.get("/api/donors/{donor_id}", response_model=DonorResponse)
async def get_donor(donor_id: int):
    def get_donor_by_id():
        try:
            donor = Donor.objects.get(id=donor_id)
            donor.check_eligibility() # Update eligibility before returning
            return donor
        except Donor.DoesNotExist:
            raise HTTPException(status_code=404, detail="Donor not found")
    try:
        donor = await run_in_threadpool(get_donor_by_id)
        return DonorResponse(
            id=donor.id,
            donor_name=donor.donor_name,
            gender=donor.gender,
            blood_type=donor.blood_type,
            phone=donor.phone,
            email=donor.email,
            last_donation_date=donor.last_donation_date,
            status=donor.status,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting donor: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
# === EDIT DONOR ===
@router.put("/api/donors/{donor_id}", response_model=DonorResponse)
async def edit_donor(donor_id: int, request: Request):
    body = await request.json()
    print(f"🟡 Editing donor {donor_id} with data: {body}")
    try:
        data = DonorSchema(**body)
    except ValidationError as e:
        print(f"❌ Validation error: {e.errors()}")
        raise HTTPException(status_code=422, detail=e.errors())
    def update():
        try:
            donor = Donor.objects.get(id=donor_id)
            print(f"🟡 Found donor: {donor.donor_name} (ID: {donor.id})")
           
            # Store old status for notification
            old_status = donor.status
           
            # Check for duplicate phone (excluding current donor)
            if Donor.objects.filter(phone=data.phone).exclude(id=donor_id).exists():
                return {"error": "PHONE_EXISTS"}
           
            # Check for duplicate email (excluding current donor)
            if data.email and Donor.objects.filter(email=data.email).exclude(id=donor_id).exists():
                return {"error": "EMAIL_EXISTS"}
           
            # Update fields
            donor.donor_name = data.donor_name
            donor.gender = data.gender
            donor.blood_type = data.blood_type
            donor.phone = data.phone
            donor.email = data.email if data.email else None
            donor.last_donation_date = data.last_donation_date
           
            donor.save()
           
            # Recalculate eligibility after updating dates
            donor.check_eligibility()
           
            print(f"✅ Donor {donor_id} updated successfully")
            return donor, old_status
           
        except Donor.DoesNotExist:
            print(f"❌ Donor {donor_id} not found")
            raise HTTPException(status_code=404, detail="Donor not found.")
        except IntegrityError as e:
            print(f"❌ Integrity error: {str(e)}")
            if "phone" in str(e).lower():
                return {"error": "PHONE_EXISTS"}
            elif "email" in str(e).lower():
                return {"error": "EMAIL_EXISTS"}
            raise HTTPException(status_code=400, detail="Database constraint error.")
        except Exception as e:
            print(f"❌ Error updating donor: {str(e)}")
            if "is not a valid choice" in str(e):
                raise HTTPException(status_code=400, detail="Invalid value for blood type or gender.")
            return {"error": "SAVE_FAILED"}
    try:
        result = await run_in_threadpool(update)
       
        if isinstance(result, tuple):
            donor, old_status = result
           
            # Determine what type of notification to send
            if old_status != donor.status:
                # Status changed - send combined notification
                notification_data = {
                    "donor": donor,
                    "old_status": old_status,
                    "new_status": donor.status,
                    "became_eligible": donor.status == "Eligible",
                    "update_type": "status_change"
                }
                await safe_send_donor_notification("updated", notification_data)
            else:
                # Regular update, no status change
                await safe_send_donor_notification("updated", donor)
           
            return DonorResponse(
                id=donor.id,
                donor_name=donor.donor_name,
                gender=donor.gender,
                blood_type=donor.blood_type,
                phone=donor.phone,
                email=donor.email,
                last_donation_date=donor.last_donation_date,
                status=donor.status,
            )
        else:
            error_msg = result["error"]
            if error_msg == "PHONE_EXISTS":
                raise HTTPException(
                    status_code=400,
                    detail="Phone number already exists. Please use a unique phone."
                )
            elif error_msg == "EMAIL_EXISTS":
                raise HTTPException(
                    status_code=400,
                    detail="Email already exists. Please use a unique email."
                )
            elif error_msg == "SAVE_FAILED":
                raise HTTPException(status_code=500, detail="Failed to update donor.")
            else:
                raise HTTPException(status_code=500, detail="Unknown error occurred.")
               
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in edit_donor: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
# === DELETE DONOR ===
@router.delete("/api/donors/{donor_id}")
async def delete_donor(donor_id: int):
    def delete():
        try:
            donor = Donor.objects.get(id=donor_id)
            # Store donor data for notification before deletion
            donor_data = {
                'id': donor.id,
                'donor_name': donor.donor_name,
                'blood_type': donor.blood_type,
                'phone': donor.phone,
                'email': donor.email,
                'status': donor.status
            }
            donor.delete()
            return donor_data
        except Donor.DoesNotExist:
            raise HTTPException(status_code=404, detail="Donor not found.")
    try:
        donor_data = await run_in_threadpool(delete)
        # Send deletion notification
        await safe_send_donor_notification("deleted", donor_data)
        return {"success": True, "message": "Donor deleted successfully"}
    except HTTPException:
        raise
# === RECORD DONATION ===
@router.post("/api/donors/{donor_id}/record-donation")
async def record_donation(donor_id: int, units_donated: int):
    def record():
        try:
            donor = Donor.objects.get(id=donor_id)
           
            # Store old status
            old_status = donor.status
           
            # Update last donation date
            from datetime import date
            donor.last_donation_date = date.today()
           
            # Save and check eligibility (will set to Not Eligible since just donated)
            donor.save()
            donor.check_eligibility()
           
            return donor, old_status, units_donated
        except Donor.DoesNotExist:
            raise HTTPException(status_code=404, detail="Donor not found.")
    try:
        donor, old_status, units = await run_in_threadpool(record)
       
        # Send donation received notification
        await safe_send_donor_notification("donation_received", donor, units_donated=units)
       
        # Send eligibility change notification if status changed
        if old_status != donor.status:
            await safe_send_donor_notification("eligibility_changed", donor, old_status, donor.status)
       
        # Also update corresponding blood group
        try:
            blood_group = await run_in_threadpool(BloodGroup.objects.get, blood_type=donor.blood_type)
            old_units = blood_group.available_units
            blood_group.available_units += units
            await run_in_threadpool(blood_group.save)
           
            # Send blood stock update notification
            from fastapi_app.routers.add_bloodgroup import safe_send_blood_notification
            blood_group_data = {
                'id': blood_group.id,
                'blood_type': blood_group.blood_type,
                'available_units': blood_group.available_units,
                'status': blood_group.status
            }
            await safe_send_blood_notification("stock_updated", blood_group_data, old_units, blood_group.available_units)
            await safe_send_blood_notification("donation_received", blood_group_data, units_received=units)
           
        except BloodGroup.DoesNotExist:
            print(f"⚠️ No blood group found for type: {donor.blood_type}")
       
        return {"success": True, "message": f"Donation of {units} units recorded successfully"}
    except HTTPException:
        raise
# === SEND URGENT BLOOD REQUEST ===
@router.post("/api/donors/urgent-request")
async def send_urgent_blood_request(blood_type: str, units_needed: int, patient_name: Optional[str] = None):
    try:
        # Get all eligible donors with the specified blood type
        def get_eligible_donors():
            donors = Donor.objects.filter(
                blood_type=blood_type,
                status="Eligible"
            )
            return list(donors)
       
        eligible_donors = await run_in_threadpool(get_eligible_donors)
       
        # Send notification to each eligible donor
        for donor in eligible_donors:
            await safe_send_donor_notification(
                "urgent_request",
                donor,
                units_needed=units_needed,
                patient_name=patient_name
            )
           
        return {
            "success": True,
            "message": f"Urgent blood request sent to {len(eligible_donors)} eligible donors",
            "notified_donors": len(eligible_donors)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send urgent request: {str(e)}")
# === CHECK ALL DONORS ELIGIBILITY ===
@router.post("/api/donors/check-eligibility")
async def check_all_donors_eligibility():
    """Endpoint to manually trigger eligibility check for all donors"""
    def check_eligibility():
        donors = Donor.objects.all()
        status_changes = []
       
        for donor in donors:
            old_status = donor.status
            donor.check_eligibility()
           
            if old_status != donor.status:
                status_changes.append({
                    'donor_id': donor.id,
                    'donor_name': donor.donor_name,
                    'old_status': old_status,
                    'new_status': donor.status
                })
       
        return status_changes
   
    try:
        changes = await run_in_threadpool(check_eligibility)
       
        # Send notifications for status changes
        for change in changes:
            donor = await run_in_threadpool(Donor.objects.get, id=change['donor_id'])
            await safe_send_donor_notification(
                "eligibility_changed",
                donor,
                change['old_status'],
                change['new_status']
            )
           
        return {
            "success": True,
            "message": f"Eligibility checked for all donors. {len(changes)} status changes detected.",
            "changes": changes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check eligibility: {str(e)}")