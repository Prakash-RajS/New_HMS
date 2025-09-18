from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
from HMS_backend.models import BloodGroup
from starlette.concurrency import run_in_threadpool
from typing import Optional

router = APIRouter(prefix="/blood-groups", tags=["Blood Groups"])


# ---------- Add Blood Group ----------
@router.post("/add")
async def add_blood_group(
    blood_type: str = Form(...),
    available_units: int = Form(...),
    status: str = Form("Available"),
):
    try:
        # Check if blood group already exists
        exists = await run_in_threadpool(BloodGroup.objects.filter(blood_type=blood_type).exists)
        if exists:
            raise HTTPException(status_code=400, detail="Blood group already exists")

        blood_group = await run_in_threadpool(
            BloodGroup.objects.create,
            blood_type=blood_type,
            available_units=available_units,
            status=status,
        )

        return JSONResponse(
            content={
                "success": True,
                "message": "Blood group added successfully",
                "id": blood_group.id,
                "blood_type": blood_group.blood_type,
                "available_units": blood_group.available_units,
                "status": blood_group.status,
            }
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------- Edit Blood Group ----------
@router.put("/{blood_id}/edit")
async def edit_blood_group(
    blood_id: int,
    blood_type: Optional[str] = Form(None),
    available_units: Optional[int] = Form(None),
    status: Optional[str] = Form(None),
):
    try:
        blood_group = await run_in_threadpool(BloodGroup.objects.get, id=blood_id)

        if blood_type:
            blood_group.blood_type = blood_type
        if available_units is not None:
            blood_group.available_units = available_units
        if status:
            blood_group.status = status

        await run_in_threadpool(blood_group.save)

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
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------- List Blood Groups ----------
@router.get("/")
async def list_blood_groups():
    try:
        blood_groups = await run_in_threadpool(lambda: list(BloodGroup.objects.all().values()))
        return {"blood_groups": blood_groups}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
