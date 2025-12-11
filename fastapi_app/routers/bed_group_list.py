from fastapi import APIRouter, HTTPException, status, Form
from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from HMS_backend.models import BedGroup, Bed, Patient
import django.db.models as models
from datetime import datetime
from asgiref.sync import sync_to_async
from fastapi.concurrency import run_in_threadpool
router = APIRouter(prefix="/bedgroups", tags=["Bed Groups"])
# ---------------------------
# Pydantic Schemas
# ---------------------------
class BedGroupBase(BaseModel):
    bedGroup: str
    capacity: int
class BedGroupCreate(BedGroupBase):
    pass
class PatientInfo(BaseModel):
    id: str
    name: str
    admission_date: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
class BedBase(BaseModel):
    bed_number: int
    is_occupied: bool
class BedResponse(BedBase):
    id: int
    patient: Optional[PatientInfo] = None
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
class BedGroupResponse(BedGroupBase):
    id: int
    occupied: int
    unoccupied: int
    status: str
    beds: List[BedResponse] = []
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)
    @classmethod
    async def from_orm_with_beds(cls, group: BedGroup):
        beds = []
        # Use sync_to_async for related objects with proper prefetching
        group_beds = await sync_to_async(list)(
            group.beds.all().select_related('patient', 'bed_group')
        )
       
        for bed in group_beds:
            patient_info = None
            if bed.patient_id:
                # Patient is already loaded due to select_related
                patient_obj = bed.patient
                patient_info = PatientInfo(
                    id=str(patient_obj.patient_unique_id),
                    name=str(patient_obj.full_name),
                    admission_date=patient_obj.admission_date,
                )
            beds.append(
                BedResponse(
                    id=bed.id,
                    bed_number=bed.bed_number,
                    is_occupied=bed.is_occupied,
                    patient=patient_info,
                )
            )
        return cls(
            id=group.id,
            bedGroup=group.bedGroup,
            capacity=group.capacity,
            occupied=group.occupied,
            unoccupied=group.unoccupied,
            status=group.status,
            beds=beds,
        )
# ---------------------------
# Helper Functions
# ---------------------------
async def _next_bed_number() -> int:
    """Return the next free global bed number."""
    result = await sync_to_async(
        lambda: Bed.objects.aggregate(max_num=models.Max("bed_number"))["max_num"]
    )()
    return (result or 0) + 1
# ---------------------------
# Helper function for bed notifications
# ---------------------------
async def safe_send_bed_notification(notification_type: str, bed_data, patient=None, patient_name=None, old_occupied=None, new_occupied=None, old_capacity=None, new_capacity=None):
    """Safely send bed management notifications with error handling"""
    try:
        print(f"🔔 [BED] Starting {notification_type} notification")
       
        from ..routers.notifications import NotificationService
       
        if notification_type == "bed_group_created":
            await NotificationService.send_bed_group_created(bed_data)
        elif notification_type == "bed_group_updated":
            await NotificationService.send_bed_group_updated(bed_data)
        elif notification_type == "bed_group_deleted":
            await NotificationService.send_bed_group_deleted(bed_data)
        elif notification_type == "bed_created":
            await NotificationService.send_bed_created(bed_data)
        elif notification_type == "bed_updated":
            await NotificationService.send_bed_updated(bed_data)
        elif notification_type == "bed_deleted":
            await NotificationService.send_bed_deleted(bed_data)
        elif notification_type == "bed_allocated" and patient:
            await NotificationService.send_bed_allocated(bed_data, patient)
        elif notification_type == "bed_vacated" and patient_name:
            await NotificationService.send_bed_vacated(bed_data, patient_name)
        elif notification_type == "room_occupancy_changed" and old_occupied is not None and new_occupied is not None:
            await NotificationService.send_room_occupancy_changed(bed_data, old_occupied, new_occupied)
        elif notification_type == "bed_capacity_changed" and old_capacity is not None and new_capacity is not None:
            await NotificationService.send_bed_capacity_changed(bed_data, old_capacity, new_capacity)
        else:
            print(f"⚠️ [BED] Unknown notification type or missing parameters: {notification_type}")
           
        print(f"✅ [BED] {notification_type} notification sent successfully")
           
    except ImportError as e:
        print(f"❌ [BED] NotificationService not available: {e}")
    except Exception as e:
        print(f"❌ [BED] Failed to send {notification_type} notification: {e}")
# ---------------------------
# Routes with Notifications
# ---------------------------
# CREATE BED GROUP
@router.post("/add", response_model=BedGroupResponse)
async def create_bed_group(group: BedGroupCreate):
    # Check if bed group exists
    exists = await sync_to_async(
        lambda: BedGroup.objects.filter(bedGroup=group.bedGroup).exists()
    )()
   
    if exists:
        raise HTTPException(status_code=400, detail="Bed group already exists")
    start = await _next_bed_number()
   
    # Create new bed group
    new_group = await sync_to_async(BedGroup.objects.create)(
        bedGroup=group.bedGroup,
        capacity=group.capacity,
        occupied=0,
        unoccupied=group.capacity,
        status="Available",
    )
    # Create beds with global numbers
    beds_created = []
    for offset in range(group.capacity):
        bed = await sync_to_async(Bed.objects.create)(
            bed_number=start + offset,
            bed_group=new_group,
            is_occupied=False,
        )
        beds_created.append(bed)
    # Send notifications
    await safe_send_bed_notification("bed_group_created", new_group)
   
    for bed in beds_created:
        await safe_send_bed_notification("bed_created", bed)
    return await BedGroupResponse.from_orm_with_beds(new_group)
# GET ALL BED GROUPS
@router.get("/all", response_model=List[BedGroupResponse])
async def get_bed_groups():
    # Prefetch all related data in one query
    groups = await sync_to_async(list)(
        BedGroup.objects.all().prefetch_related('beds__patient')
    )
    results = []
    for group in groups:
        result = await BedGroupResponse.from_orm_with_beds(group)
        results.append(result)
    return results
# GET BEDS OF A GROUP
@router.get("/{group_id}/beds", response_model=BedGroupResponse)
async def get_beds(group_id: int):
    try:
        group = await sync_to_async(
            lambda: BedGroup.objects.prefetch_related('beds__patient').get(id=group_id)
        )()
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    return await BedGroupResponse.from_orm_with_beds(group)
# ADMIT PATIENT
@router.post("/admit", response_model=Dict[str, Any])
async def admit_patient(
    full_name: str = Form(...),
    patient_unique_id: str = Form(...),
    bed_group_name: str = Form(...),
    bed_number: int = Form(...),
    admission_date: str = Form(...),
):
    # ---------------------------
    # Validate date
    # ---------------------------
    try:
        admit_date = datetime.strptime(admission_date, "%m/%d/%Y").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use MM/DD/YYYY")
    # ---------------------------
    # Fetch Patient
    # ---------------------------
    try:
        patient = await sync_to_async(Patient.objects.get)(patient_unique_id=patient_unique_id)
        if patient.full_name != full_name:
            raise HTTPException(status_code=400, detail="Patient ID exists with different name")
    except Patient.DoesNotExist:
        raise HTTPException(status_code=404, detail="Patient not found. Register first.")
    # ---------------------------
    # Prevent Double Admission
    # ---------------------------
    patient_beds_exists = await sync_to_async(
        lambda: patient.beds.filter(is_occupied=True).exists()
    )()
    if patient_beds_exists:
        current_bed = await sync_to_async(
            lambda: patient.beds.select_related('bed_group').filter(is_occupied=True).first()
        )()
        raise HTTPException(
            status_code=400,
            detail=(
                f"Patient is already admitted in Bed {current_bed.bed_number} "
                f"({current_bed.bed_group.bedGroup}). Discharge first."
            ),
        )
    # ---------------------------
    # Fetch Bed Group & Bed
    # ---------------------------
    try:
        bed_group = await sync_to_async(BedGroup.objects.get)(bedGroup=bed_group_name)
        bed = await sync_to_async(
            lambda: Bed.objects.select_related('bed_group', 'patient').get(
                bed_group=bed_group, bed_number=bed_number
            )
        )()
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    except Bed.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed not found")
    # ---------------------------
    # Check bed occupancy
    # ---------------------------
    if bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already occupied")
    old_occupied = bed_group.occupied # for notification trigger
    # ---------------------------
    # Update Patient Admission Details
    # ---------------------------
    formatted_room = f"{bed_group.bedGroup} - {bed_number}" # <<<< IMPORTANT LINE
    patient.admission_date = admit_date
    patient.room_number = formatted_room
    # 🚀 Save only these fields
    await sync_to_async(patient.save)(
        update_fields=["admission_date", "room_number"]
    )
    # ---------------------------
    # Allocate Bed
    # ---------------------------
    bed.is_occupied = True
    bed.patient = patient
    await sync_to_async(bed.save)()
    # Refresh counts
    await sync_to_async(bed_group.refresh_counts)()
    # Reload bed with relations
    bed_with_relations = await sync_to_async(
        lambda: Bed.objects.select_related('bed_group', 'patient').get(id=bed.id)
    )()
    # ---------------------------
    # Send Notifications
    # ---------------------------
    await safe_send_bed_notification("bed_allocated", bed_with_relations, patient=patient)
    await safe_send_bed_notification("bed_updated", bed_with_relations)
    if old_occupied != bed_group.occupied:
        await safe_send_bed_notification(
            "room_occupancy_changed",
            bed_group,
            old_occupied,
            bed_group.occupied
        )
    # ---------------------------
    # Response
    # ---------------------------
    return {
        "success": True,
        "message": "Patient admitted and bed allocated",
        "patient": {
            "id": patient.patient_unique_id,
            "name": patient.full_name,
            "admission_date": admit_date.strftime("%m/%d/%Y"),
            "room_number": formatted_room, # ICU - 1 format
        },
        "bed": {
            "number": bed.bed_number,
            "group": bed_group.bedGroup,
        },
    }
# VACATE BED (Discharge)
@router.post("/{group_id}/beds/{bed_number}/vacate", response_model=BedGroupResponse)
async def vacate_bed(group_id: int, bed_number: int):
    try:
        group = await sync_to_async(BedGroup.objects.get)(id=group_id)
        bed = await sync_to_async(
            lambda: Bed.objects.select_related('bed_group', 'patient').get(
                bed_group=group, bed_number=bed_number
            )
        )()
    except (BedGroup.DoesNotExist, Bed.DoesNotExist):
        raise HTTPException(status_code=404, detail="Bed or Bed group not found")
    if not bed.is_occupied:
        raise HTTPException(status_code=400, detail="Bed is already vacant")
    # Store patient name for notification before clearing
    patient_name = bed.patient.full_name if bed.patient else "Unknown Patient"
    old_occupied = group.occupied
    # Update discharge date on patient
    if bed.patient:
        bed.patient.discharge_date = datetime.now().date()
        await sync_to_async(bed.patient.save)()
    bed.is_occupied = False
    bed.patient = None
    await sync_to_async(bed.save)()
    # Refresh group counts
    await sync_to_async(group.refresh_counts)()
    # Reload bed with relations for notification
    bed_with_relations = await sync_to_async(
        lambda: Bed.objects.select_related('bed_group').get(id=bed.id)
    )()
    # Send notifications
    await safe_send_bed_notification("bed_vacated", bed_with_relations, patient_name=patient_name)
    await safe_send_bed_notification("bed_updated", bed_with_relations)
   
    if old_occupied != group.occupied:
        await safe_send_bed_notification("room_occupancy_changed", group, old_occupied, group.occupied)
    return await BedGroupResponse.from_orm_with_beds(group)
# UPDATE BED GROUP
@router.put("/{group_id}/", response_model=BedGroupResponse)
async def update_bed_group(group_id: int, group_update: BedGroupCreate):
    try:
        bed_group = await sync_to_async(BedGroup.objects.get)(id=group_id)
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    # Check if bed group name already exists (excluding current)
    exists = await sync_to_async(
        lambda: BedGroup.objects.filter(bedGroup=group_update.bedGroup).exclude(id=group_id).exists()
    )()
    if exists:
        raise HTTPException(status_code=400, detail="Bed group name already exists")
    old_capacity = bed_group.capacity
    old_occupied = bed_group.occupied
    bed_group.bedGroup = group_update.bedGroup
    bed_group.capacity = group_update.capacity
    # Increase capacity
    if group_update.capacity > old_capacity:
        start = await _next_bed_number()
        new_beds = []
        for offset in range(group_update.capacity - old_capacity):
            bed = await sync_to_async(Bed.objects.create)(
                bed_number=start + offset,
                bed_group=bed_group,
                is_occupied=False,
            )
            new_beds.append(bed)
       
        # Send notifications for new beds
        for bed in new_beds:
            # Reload bed with relations for notification
            bed_with_relations = await sync_to_async(
                lambda: Bed.objects.select_related('bed_group').get(id=bed.id)
            )()
            await safe_send_bed_notification("bed_created", bed_with_relations)
    # Decrease capacity
    elif group_update.capacity < old_capacity:
        unoccupied_beds = await sync_to_async(list)(
            Bed.objects.select_related('bed_group').filter(
                bed_group=bed_group, is_occupied=False
            ).order_by("-bed_number")
        )
        to_remove = old_capacity - group_update.capacity
        if len(unoccupied_beds) < to_remove:
            raise HTTPException(status_code=400, detail="Cannot reduce capacity: not enough unoccupied beds")
       
        beds_to_delete = unoccupied_beds[:to_remove]
        for bed in beds_to_delete:
            bed_data = {
                'id': bed.id,
                'bed_number': bed.bed_number,
                'bed_group': bed.bed_group.bedGroup # Now accessible due to select_related
            }
            await sync_to_async(bed.delete)()
            await safe_send_bed_notification("bed_deleted", bed_data)
    await sync_to_async(bed_group.save)()
    await sync_to_async(bed_group.refresh_counts)()
    # Send notifications
    await safe_send_bed_notification("bed_group_updated", bed_group)
   
    if old_capacity != group_update.capacity:
        await safe_send_bed_notification("bed_capacity_changed", bed_group, old_capacity, group_update.capacity)
    return await BedGroupResponse.from_orm_with_beds(bed_group)
# DELETE BED GROUP
@router.delete("/{group_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bed_group(group_id: int):
    try:
        bed_group = await sync_to_async(BedGroup.objects.get)(id=group_id)
        if bed_group.occupied > 0:
            raise HTTPException(status_code=400, detail="Cannot delete: group has occupied beds")
       
        # Store data for notification before deletion
        bed_group_data = {
            'id': bed_group.id,
            'bedGroup': bed_group.bedGroup,
            'capacity': bed_group.capacity
        }
       
        # Get beds data for notifications with prefetching
        beds_data = await sync_to_async(
            lambda: [
                {
                    'id': bed.id,
                    'bed_number': bed.bed_number,
                    'bed_group': bed.bed_group.bedGroup # Accessible due to prefetching
                }
                for bed in bed_group.beds.all().select_related('bed_group')
            ]
        )()
       
        # Delete beds and group
        await sync_to_async(bed_group.beds.all().delete)()
        await sync_to_async(bed_group.delete)()
       
        # Send notifications
        await safe_send_bed_notification("bed_group_deleted", bed_group_data)
       
        for bed_data in beds_data:
            await safe_send_bed_notification("bed_deleted", bed_data)
           
    except BedGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Bed group not found")
    return None
# TRANSFER PATIENT BETWEEN BEDS (Optional - if you need this functionality)
@router.post("/transfer", response_model=Dict[str, Any])
async def transfer_patient(
    patient_unique_id: str = Form(...),
    from_bed_group: str = Form(...),
    from_bed_number: int = Form(...),
    to_bed_group: str = Form(...),
    to_bed_number: int = Form(...),
):
    try:
        # Find source bed with prefetching
        from_group = await sync_to_async(BedGroup.objects.get)(bedGroup=from_bed_group)
        from_bed = await sync_to_async(
            lambda: Bed.objects.select_related('bed_group', 'patient').get(
                bed_group=from_group, bed_number=from_bed_number
            )
        )()
       
        # Find destination bed with prefetching
        to_group = await sync_to_async(BedGroup.objects.get)(bedGroup=to_bed_group)
        to_bed = await sync_to_async(
            lambda: Bed.objects.select_related('bed_group', 'patient').get(
                bed_group=to_group, bed_number=to_bed_number
            )
        )()
       
        # Verify patient is in source bed
        if not from_bed.is_occupied or from_bed.patient.patient_unique_id != patient_unique_id:
            raise HTTPException(status_code=400, detail="Patient not found in source bed")
           
        if to_bed.is_occupied:
            raise HTTPException(status_code=400, detail="Destination bed is already occupied")
        patient = from_bed.patient
        old_from_occupied = from_group.occupied
        old_to_occupied = to_group.occupied
        # Transfer patient
        from_bed.is_occupied = False
        from_bed.patient = None
        await sync_to_async(from_bed.save)()
        to_bed.is_occupied = True
        to_bed.patient = patient
        await sync_to_async(to_bed.save)()
        # Update patient room number
        patient.room_number = str(to_bed_number)
        await sync_to_async(patient.save)()
        # Refresh group counts
        await sync_to_async(from_group.refresh_counts)()
        await sync_to_async(to_group.refresh_counts)()
        # Reload beds with relations for notifications
        from_bed_with_relations = await sync_to_async(
            lambda: Bed.objects.select_related('bed_group').get(id=from_bed.id)
        )()
        to_bed_with_relations = await sync_to_async(
            lambda: Bed.objects.select_related('bed_group', 'patient').get(id=to_bed.id)
        )()
        # Send notifications
        await safe_send_bed_notification("bed_vacated", from_bed_with_relations, patient_name=patient.full_name)
        await safe_send_bed_notification("bed_allocated", to_bed_with_relations, patient=patient)
        await safe_send_bed_notification("bed_updated", from_bed_with_relations)
        await safe_send_bed_notification("bed_updated", to_bed_with_relations)
       
        if old_from_occupied != from_group.occupied:
            await safe_send_bed_notification("room_occupancy_changed", from_group, old_from_occupied, from_group.occupied)
           
        if old_to_occupied != to_group.occupied:
            await safe_send_bed_notification("room_occupancy_changed", to_group, old_to_occupied, to_group.occupied)
        return {
            "success": True,
            "message": f"Patient transferred from Bed {from_bed_number} to Bed {to_bed_number}",
            "patient": {
                "id": patient.patient_unique_id,
                "name": patient.full_name,
            },
            "from_bed": {
                "number": from_bed_number,
                "group": from_bed_group,
            },
            "to_bed": {
                "number": to_bed_number,
                "group": to_bed_group,
            },
        }
    except (BedGroup.DoesNotExist, Bed.DoesNotExist):
        raise HTTPException(status_code=404, detail="Bed or bed group not found")