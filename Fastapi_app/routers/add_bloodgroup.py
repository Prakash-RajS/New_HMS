from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from asgiref.sync import sync_to_async  # Add this import
from django.db import transaction  # Add this import
from HMS_backend.models import BloodGroup
from starlette.concurrency import run_in_threadpool
from typing import Optional
from pydantic import BaseModel

# Create router WITHOUT prefix to manually define paths
router = APIRouter()

class BloodGroupCreate(BaseModel):
    blood_type: str
    available_units: int
    status: str = "Available"

class BloodGroupUpdate(BaseModel):
    blood_type: Optional[str] = None
    available_units: Optional[int] = None
    status: Optional[str] = None

# ---------- Add Blood Group ----------
@router.post("/api/blood-groups/add")
async def add_blood_group(blood_data: BloodGroupCreate):
    try:
        print(f"🔵 Received blood group data: {blood_data.dict()}")
        
        # Check if blood group already exists
        exists = await run_in_threadpool(
            lambda: BloodGroup.objects.filter(blood_type=blood_data.blood_type).exists()
        )
        
        if exists:
            raise HTTPException(status_code=400, detail="Blood group already exists")

        # Create new blood group
        blood_group = BloodGroup(
            blood_type=blood_data.blood_type,
            available_units=blood_data.available_units,
            status=blood_data.status
        )
        await run_in_threadpool(blood_group.save)
        
        print(f"✅ Blood group created: {blood_group.id} - {blood_group.blood_type}")

        return JSONResponse(
            content={
                "success": True,
                "message": "Blood group added successfully",
                "id": blood_group.id,
                "blood_type": blood_group.blood_type,
                "available_units": blood_group.available_units,
                "status": blood_group.status,
            },
            status_code=201
        )

    except Exception as e:
        print(f"❌ Error adding blood group: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ---------- List Blood Groups ----------
@router.get("/api/blood-groups/")
async def list_blood_groups():
    try:
        blood_groups = await run_in_threadpool(
            lambda: list(BloodGroup.objects.all().values(
                'id', 'blood_type', 'available_units', 'status', 'created_at', 'updated_at'
            ))
        )
        print(f"✅ Fetched {len(blood_groups)} blood groups")
        return {"blood_groups": blood_groups}
    except Exception as e:
        print(f"❌ Error fetching blood groups: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
# === GET BLOOD TYPES (From Existing Blood Groups) ===
# === GET BLOOD TYPES (From Existing Blood Groups) ===
@router.get("/api/blood-types/")
async def get_blood_types():
    """
    Get blood types from existing blood groups in database
    """
    try:
        print("🟡 GET /api/blood-types/ endpoint called")
        
        # Get distinct blood types from existing blood groups
        blood_groups = await run_in_threadpool(
            lambda: list(BloodGroup.objects.all().values_list('blood_type', flat=True).distinct())
        )
        
        print(f"🟡 Found blood types in DB: {blood_groups}")
        
        # If no blood groups exist, return default types
        if not blood_groups:
            blood_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
            print("🟡 No blood groups in DB, using default types")
        
        response_data = {
            "success": True,
            "blood_types": blood_groups
        }
        
        print(f"✅ Returning blood types: {response_data}")
        return JSONResponse(content=response_data)
        
    except Exception as e:
        print(f"❌ Error fetching blood types: {str(e)}")
        # Return default types as fallback
        fallback_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        return JSONResponse(
            content={
                "success": True,
                "blood_types": fallback_types
            }
        )

# ---------- Edit Blood Group ----------
@router.put("/api/blood-groups/{blood_id}/edit")
async def edit_blood_group(blood_id: int, blood_data: BloodGroupUpdate):
    try:
        print(f"🟡 Editing blood group {blood_id} with data: {blood_data.dict()}")
        
        # Get the blood group
        blood_group = await sync_to_async(BloodGroup.objects.get)(id=blood_id)
        print(f"🟡 Current blood group: {blood_group.blood_type} (ID: {blood_group.id})")

        # Update blood type if provided
        if blood_data.blood_type:
            print(f"🟡 Requested blood type: {blood_data.blood_type}")
            print(f"🟡 Current blood type: {blood_group.blood_type}")
            print(f"🟡 Are they different? {blood_data.blood_type != blood_group.blood_type}")
            
            if blood_data.blood_type != blood_group.blood_type:
                # Check if any other blood group has this type
                print(f"🟡 Checking if blood type {blood_data.blood_type} exists (excluding ID {blood_id})")
                
                exists = await sync_to_async(
                    lambda: BloodGroup.objects.filter(
                        blood_type=blood_data.blood_type
                    ).exclude(id=blood_id).exists()
                )()
                
                print(f"🟡 Blood type exists check result: {exists}")
                
                if exists:
                    # Get the conflicting blood group for debugging
                    conflicting = await sync_to_async(
                        lambda: list(BloodGroup.objects.filter(
                            blood_type=blood_data.blood_type
                        ).exclude(id=blood_id).values('id', 'blood_type'))
                    )()
                    print(f"🟡 Conflicting blood groups: {conflicting}")
                    raise HTTPException(status_code=400, detail="Blood type already exists")
            
            blood_group.blood_type = blood_data.blood_type
        
        # Update available units if provided
        if blood_data.available_units is not None:
            blood_group.available_units = blood_data.available_units
            await sync_to_async(blood_group.update_status)()
        
        # Update status if provided
        if blood_data.status:
            blood_group.status = blood_data.status

        # Save the changes
        await sync_to_async(blood_group.save)()
        
        print(f"✅ Blood group {blood_id} updated successfully to {blood_group.blood_type}")

        return JSONResponse(
            content={
                "success": True,
                "message": "Blood group updated successfully",
                "id": blood_group.id,
                "blood_type": blood_group.blood_type,
                "available_units": blood_group.available_units,
                "status": blood_group.status,
            }
        )

    except BloodGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Blood group not found")
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating blood group {blood_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ---------- Delete Blood Group ----------
@router.delete("/api/blood-groups/{blood_id}/delete")
async def delete_blood_group(blood_id: int):
    try:
        blood_group = await run_in_threadpool(BloodGroup.objects.get, id=blood_id)
        await run_in_threadpool(blood_group.delete)
        
        return JSONResponse(
            content={
                "success": True,
                "message": "Blood group deleted successfully",
            }
        )
        
    except BloodGroup.DoesNotExist:
        raise HTTPException(status_code=404, detail="Blood group not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))