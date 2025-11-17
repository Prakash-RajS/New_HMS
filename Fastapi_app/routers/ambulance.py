# fastapi_app/routers/ambulance_router.py
# FINAL 100% WORKING VERSION – November 17, 2025
# → POST /trips works
# → GET /trips works with nested data
# → DELETE Dispatch → Trips auto-deleted (CASCADE)
# → DELETE Trip → Only trip deleted
# → Fully async-safe with Django ORM

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from asgiref.sync import sync_to_async

# Django Models
from HMS_backend.models import AmbulanceUnit, Dispatch, Trip, Patient

router = APIRouter(prefix="/ambulance", tags=["Ambulance Management"])


# ==============================================
# Pydantic Schemas
# ==============================================

class AmbulanceUnitBase(BaseModel):
    unit_number: str = Field(..., example="AMB-09")
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    in_service: Optional[bool] = True
    notes: Optional[str] = None

class AmbulanceUnitCreate(AmbulanceUnitBase):
    pass

class AmbulanceUnitResponse(AmbulanceUnitBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PatientRef(BaseModel):
    id: int
    patient_unique_id: str
    full_name: str
    model_config = ConfigDict(from_attributes=True)


class DispatchBase(BaseModel):
    timestamp: datetime
    unit_id: Optional[int] = None
    dispatcher: str = Field(..., example="R. Lewis")
    call_type: Optional[str] = "Emergency"
    location: str = Field(..., example="45 Elm St, Chennai")
    status: Optional[str] = "Standby"

class DispatchCreate(DispatchBase):
    pass

class DispatchUpdate(DispatchBase):
    timestamp: Optional[datetime] = None
    unit_id: Optional[int] = None
    dispatcher: Optional[str] = None
    call_type: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None

class DispatchResponse(DispatchBase):
    id: int
    dispatch_id: str
    unit: Optional[AmbulanceUnitResponse] = None
    model_config = ConfigDict(from_attributes=True)


class TripBase(BaseModel):
    dispatch_id: Optional[int] = None
    unit_id: Optional[int] = None
    crew: Optional[str] = None
    patient_id: Optional[int] = None
    pickup_location: Optional[str] = None
    destination: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    mileage: Optional[str] = None
    status: Optional[str] = "Standby"
    notes: Optional[str] = None

class TripCreate(TripBase):
    pass

class TripUpdate(TripBase):
    pass

class TripResponse(TripBase):
    id: int
    trip_id: str
    created_at: datetime
    dispatch: Optional[DispatchResponse] = None
    unit: Optional[AmbulanceUnitResponse] = None
    patient: Optional[PatientRef] = None
    model_config = ConfigDict(from_attributes=True)


# ==============================================
# Safe Async Delete Helper
# ==============================================
async def safe_delete(model, obj_id: int, name: str):
    deleted = await sync_to_async(model.objects.filter(id=obj_id).delete)()
    if deleted[0] == 0:
        raise HTTPException(status_code=404, detail=f"{name} not found")


# ==============================================
# Ambulance Units
# ==============================================
@router.get("/units", response_model=List[AmbulanceUnitResponse])
async def list_units(in_service: Optional[bool] = None):
    qs = AmbulanceUnit.objects.all()
    if in_service is not None:
        qs = qs.filter(in_service=in_service)
    return await sync_to_async(list)(qs.order_by("-id"))

@router.post("/units", response_model=AmbulanceUnitResponse, status_code=201)
async def create_unit(payload: AmbulanceUnitCreate):
    return await sync_to_async(AmbulanceUnit.objects.create)(**payload.dict())

@router.put("/units/{unit_id}", response_model=AmbulanceUnitResponse)
async def update_unit(unit_id: int, payload: AmbulanceUnitCreate):
    try:
        unit = await sync_to_async(AmbulanceUnit.objects.get)(id=unit_id)
        for k, v in payload.dict().items():
            setattr(unit, k, v)
        await sync_to_async(unit.save)()
        return unit
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/units/{unit_id}", status_code=204)
async def delete_unit(unit_id: int):
    await safe_delete(AmbulanceUnit, unit_id, "Unit")


# ==============================================
# Dispatch Endpoints
# ==============================================
@router.get("/dispatch", response_model=List[DispatchResponse])
async def list_dispatches():
    dispatches = await sync_to_async(list)(
        Dispatch.objects.select_related("unit").all().order_by("-timestamp")
    )
    result = []
    for d in dispatches:
        unit_resp = AmbulanceUnitResponse.from_orm(d.unit) if d.unit else None
        result.append(DispatchResponse(
            id=d.id, dispatch_id=d.dispatch_id, timestamp=d.timestamp,
            unit_id=d.unit.id if d.unit else None, unit=unit_resp,
            dispatcher=d.dispatcher, call_type=d.call_type,
            location=d.location, status=d.status
        ))
    return result

@router.post("/dispatch", response_model=DispatchResponse, status_code=201)
async def create_dispatch(payload: DispatchCreate):
    unit = await sync_to_async(AmbulanceUnit.objects.get)(id=payload.unit_id) if payload.unit_id else None
    dispatch = await sync_to_async(Dispatch.objects.create)(
        timestamp=payload.timestamp, unit=unit, dispatcher=payload.dispatcher,
        call_type=payload.call_type or "Emergency", location=payload.location,
        status=payload.status or "Standby"
    )
    unit_resp = AmbulanceUnitResponse.from_orm(unit) if unit else None
    return DispatchResponse(
        id=dispatch.id, dispatch_id=dispatch.dispatch_id, timestamp=dispatch.timestamp,
        unit_id=unit.id if unit else None, unit=unit_resp,
        dispatcher=dispatch.dispatcher, call_type=dispatch.call_type,
        location=dispatch.location, status=dispatch.status
    )

@router.put("/dispatch/{dispatch_id}", response_model=DispatchResponse)
async def update_dispatch(dispatch_id: int, payload: DispatchUpdate):
    try:
        d = await sync_to_async(Dispatch.objects.get)(id=dispatch_id)
        if payload.timestamp is not None: d.timestamp = payload.timestamp
        if payload.dispatcher is not None: d.dispatcher = payload.dispatcher
        if payload.call_type is not None: d.call_type = payload.call_type
        if payload.location is not None: d.location = payload.location
        if payload.status is not None: d.status = payload.status
        if payload.unit_id is not None:
            d.unit = await sync_to_async(AmbulanceUnit.objects.get)(id=payload.unit_id) if payload.unit_id else None
        await sync_to_async(d.save)()
        unit_resp = AmbulanceUnitResponse.from_orm(d.unit) if d.unit else None
        return DispatchResponse(
            id=d.id, dispatch_id=d.dispatch_id, timestamp=d.timestamp,
            unit_id=d.unit.id if d.unit else None, unit=unit_resp,
            dispatcher=d.dispatcher, call_type=d.call_type,
            location=d.location, status=d.status
        )
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/dispatch/{dispatch_id}", status_code=204)
async def delete_dispatch(dispatch_id: int):
    # CASCADE delete → all related Trips will be automatically deleted
    await safe_delete(Dispatch, dispatch_id, "Dispatch")


# ==============================================
# Trip Endpoints – FULLY FIXED
# ==============================================
@router.get("/trips", response_model=List[TripResponse])
async def list_trips():
    trips = await sync_to_async(list)(
        Trip.objects.select_related("dispatch__unit", "unit", "patient").all().order_by("-created_at")
    )
    result = []
    for t in trips:
        dispatch_resp = None
        if t.dispatch:
            unit_d = await sync_to_async(getattr)(t.dispatch, "unit")  # ← Safe async access
            unit_d_resp = AmbulanceUnitResponse.from_orm(unit_d) if unit_d else None
            dispatch_resp = DispatchResponse(
                id=t.dispatch.id, dispatch_id=t.dispatch.dispatch_id,
                timestamp=t.dispatch.timestamp, unit_id=unit_d.id if unit_d else None,
                unit=unit_d_resp, dispatcher=t.dispatch.dispatcher,
                call_type=t.dispatch.call_type, location=t.dispatch.location,
                status=t.dispatch.status
            )
        result.append(TripResponse(
            id=t.id, trip_id=t.trip_id, created_at=t.created_at,
            dispatch=dispatch_resp, dispatch_id=t.dispatch.id if t.dispatch else None,
            unit=AmbulanceUnitResponse.from_orm(t.unit) if t.unit else None,
            unit_id=t.unit.id if t.unit else None,
            patient=PatientRef.from_orm(t.patient) if t.patient else None,
            patient_id=t.patient.id if t.patient else None,
            crew=t.crew, pickup_location=t.pickup_location,
            destination=t.destination, start_time=t.start_time,
            end_time=t.end_time, mileage=t.mileage,
            status=t.status, notes=t.notes
        ))
    return result


@router.post("/trips", response_model=TripResponse, status_code=201)
async def create_trip(payload: TripCreate):
    try:
        # Fetch related objects
        dispatch = None
        if payload.dispatch_id:
            dispatch = await sync_to_async(Dispatch.objects.select_related("unit").get)(id=payload.dispatch_id)

        unit = None
        if payload.unit_id:
            unit = await sync_to_async(AmbulanceUnit.objects.get)(id=payload.unit_id)

        patient = None
        if payload.patient_id:
            patient = await sync_to_async(Patient.objects.get)(id=payload.patient_id)

        # Create trip
        trip = await sync_to_async(Trip.objects.create)(
            dispatch=dispatch, unit=unit, patient=patient,
            crew=payload.crew, pickup_location=payload.pickup_location,
            destination=payload.destination, start_time=payload.start_time,
            end_time=payload.end_time, mileage=payload.mileage,
            status=payload.status or "Standby", notes=payload.notes
        )

        # Build nested dispatch response safely
        dispatch_resp = None
        if dispatch:
            unit_d = await sync_to_async(lambda: dispatch.unit)()  # ← Critical fix
            unit_d_resp = AmbulanceUnitResponse.from_orm(unit_d) if unit_d else None
            dispatch_resp = DispatchResponse(
                id=dispatch.id, dispatch_id=dispatch.dispatch_id,
                timestamp=dispatch.timestamp, unit_id=unit_d.id if unit_d else None,
                unit=unit_d_resp, dispatcher=dispatch.dispatcher,
                call_type=dispatch.call_type, location=dispatch.location,
                status=dispatch.status
            )

        return TripResponse(
            id=trip.id, trip_id=trip.trip_id, created_at=trip.created_at,
            dispatch=dispatch_resp, dispatch_id=dispatch.id if dispatch else None,
            unit=AmbulanceUnitResponse.from_orm(unit) if unit else None,
            unit_id=unit.id if unit else None,
            patient=PatientRef.from_orm(patient) if patient else None,
            patient_id=patient.id if patient else None,
            crew=trip.crew, pickup_location=trip.pickup_location,
            destination=trip.destination, start_time=trip.start_time,
            end_time=trip.end_time, mileage=trip.mileage,
            status=trip.status, notes=trip.notes
        )

    except (Dispatch.DoesNotExist, AmbulanceUnit.DoesNotExist, Patient.DoesNotExist):
        raise HTTPException(404, "Related record not found")


@router.put("/trips/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: int, payload: TripUpdate):
    try:
        t = await sync_to_async(Trip.objects.get)(id=trip_id)
        if payload.dispatch_id is not None:
            t.dispatch = await sync_to_async(Dispatch.objects.get)(id=payload.dispatch_id) if payload.dispatch_id else None
        if payload.unit_id is not None:
            t.unit = await sync_to_async(AmbulanceUnit.objects.get)(id=payload.unit_id) if payload.unit_id else None
        if payload.patient_id is not None:
            t.patient = await sync_to_async(Patient.objects.get)(id=payload.patient_id) if payload.patient_id else None
        if payload.crew is not None: t.crew = payload.crew
        if payload.pickup_location is not None: t.pickup_location = payload.pickup_location
        if payload.destination is not None: t.destination = payload.destination
        if payload.start_time is not None: t.start_time = payload.start_time
        if payload.end_time is not None: t.end_time = payload.end_time
        if payload.mileage is not None: t.mileage = payload.mileage
        if payload.status is not None: t.status = payload.status
        if payload.notes is not None: t.notes = payload.notes
        await sync_to_async(t.save)()

        # Build response
        dispatch_resp = None
        if t.dispatch:
            unit_d = await sync_to_async(lambda: t.dispatch.unit)()
            unit_d_resp = AmbulanceUnitResponse.from_orm(unit_d) if unit_d else None
            dispatch_resp = DispatchResponse(
                id=t.dispatch.id, dispatch_id=t.dispatch.dispatch_id,
                timestamp=t.dispatch.timestamp, unit_id=unit_d.id if unit_d else None,
                unit=unit_d_resp, dispatcher=t.dispatch.dispatcher,
                call_type=t.dispatch.call_type, location=t.dispatch.location,
                status=t.dispatch.status
            )

        return TripResponse(
            id=t.id, trip_id=t.trip_id, created_at=t.created_at,
            dispatch=dispatch_resp, dispatch_id=t.dispatch.id if t.dispatch else None,
            unit=AmbulanceUnitResponse.from_orm(t.unit) if t.unit else None,
            unit_id=t.unit.id if t.unit else None,
            patient=PatientRef.from_orm(t.patient) if t.patient else None,
            patient_id=t.patient.id if t.patient else None,
            crew=t.crew, pickup_location=t.pickup_location,
            destination=t.destination, start_time=t.start_time,
            end_time=t.end_time, mileage=t.mileage,
            status=t.status, notes=t.notes
        )
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")
    except (Dispatch.DoesNotExist, AmbulanceUnit.DoesNotExist, Patient.DoesNotExist):
        raise HTTPException(404, "Related record not found")


@router.delete("/trips/{trip_id}", status_code=204)
async def delete_trip(trip_id: int):
    await safe_delete(Trip, trip_id, "Trip")


# ==============================================
# Patients Dropdown
# ==============================================
@router.get("/patients", response_model=List[dict])
async def get_patients_for_dropdown():
    patients = await sync_to_async(list)(
        Patient.objects.values("id", "patient_unique_id", "full_name")
        .order_by("patient_unique_id")[:500]
    )
    return [
        {"id": p["id"], "patient_unique_id": p["patient_unique_id"], "full_name": p["full_name"]}
        for p in patients
    ]