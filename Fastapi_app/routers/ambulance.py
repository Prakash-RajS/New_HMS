from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime
from asgiref.sync import sync_to_async
from collections import defaultdict

# import Django models
from HMS_backend.models import AmbulanceUnit, Dispatch, Trip

router = APIRouter(prefix="/ambulance", tags=["Ambulance Management"])

# -----------------------
# Pydantic Schemas
# -----------------------
class AmbulanceUnitBase(BaseModel):
    unit_number: str
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


class DispatchBase(BaseModel):
    dispatch_id: str = Field(..., example="D-10241")
    timestamp: datetime
    unit_id: Optional[int] = None
    dispatcher: str
    call_type: Optional[str] = "Emergency"
    location: str
    status: Optional[str] = "Standby"

class DispatchCreate(DispatchBase):
    pass

class DispatchUpdate(DispatchBase):
    pass

class DispatchResponse(DispatchBase):
    id: int
    unit: Optional[AmbulanceUnitResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    async def from_orm_with_unit(cls, obj: Dispatch):
        # ensure unit access in sync
        def get_unit():
            unit = obj.unit
            return unit
        unit = await sync_to_async(get_unit)()
        unit_resp = None
        if unit:
            unit_resp = AmbulanceUnitResponse(
                id=unit.id,
                unit_number=unit.unit_number,
                vehicle_make=unit.vehicle_make,
                vehicle_model=unit.vehicle_model,
                created_at=unit.created_at
            )
        return cls(
            id=obj.id,
            dispatch_id=obj.dispatch_id,
            timestamp=obj.timestamp,
            unit_id=unit.id if unit else None,
            unit=unit_resp,
            dispatcher=obj.dispatcher,
            call_type=obj.call_type,
            location=obj.location,
            status=obj.status,
        )


class TripBase(BaseModel):
    trip_id: str = Field(..., example="T-7751")
    dispatch_id: Optional[int] = None
    unit_id: Optional[int] = None
    crew: Optional[str] = None
    patient_id: Optional[str] = None
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
    dispatch: Optional[DispatchResponse] = None
    unit: Optional[AmbulanceUnitResponse] = None

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    async def from_orm_with_details(cls, obj: Trip):
        # fetch related dispatch & unit safely
        def get_related():
            dispatch = obj.dispatch
            unit = obj.unit
            return (dispatch, unit)
        dispatch, unit = await sync_to_async(get_related)()

        dispatch_resp = None
        if dispatch:
            dispatch_resp = await DispatchResponse.from_orm_with_unit(dispatch)

        unit_resp = None
        if unit:
            unit_resp = AmbulanceUnitResponse(
                id=unit.id,
                unit_number=unit.unit_number,
                vehicle_make=unit.vehicle_make,
                vehicle_model=unit.vehicle_model,
                in_service=unit.in_service,
                notes=unit.notes,
                created_at=unit.created_at
            )

        return cls(
            id=obj.id,
            trip_id=obj.trip_id,
            dispatch_id=obj.dispatch.id if obj.dispatch else None,
            dispatch=dispatch_resp,
            unit_id=unit.id if unit else None,
            unit=unit_resp,
            crew=obj.crew,
            patient_id=obj.patient_id,
            pickup_location=obj.pickup_location,
            destination=obj.destination,
            start_time=obj.start_time,
            end_time=obj.end_time,
            mileage=obj.mileage,
            status=obj.status,
            notes=obj.notes
        )

# -----------------------
# Utility: seed sample data (call from a dev-only endpoint if wanted)
# -----------------------
@router.post("/seed", summary="Seed sample units/dispatches/trips (dev only)")
async def seed_sample():
    def seed_sync():
        # create units
        u1, _ = AmbulanceUnit.objects.get_or_create(unit_number="AMB-09", defaults={"vehicle_make":"Ford","vehicle_model":"Transit"})
        u2, _ = AmbulanceUnit.objects.get_or_create(unit_number="AMB-08", defaults={"vehicle_make":"Toyota","vehicle_model":"HiAce"})
        u3, _ = AmbulanceUnit.objects.get_or_create(unit_number="AMB-07", defaults={"vehicle_make":"Mercedes","vehicle_model":"Sprinter"})
        # dispatches
        from django.utils import timezone
        ts = timezone.now()
        d1, _ = Dispatch.objects.get_or_create(dispatch_id="D-10241", defaults={
            "timestamp": ts, "unit":u1, "dispatcher":"R. Lewis", "call_type":"Emergency", "location":"45 Elm St.", "status":"Completed"
        })
        d2, _ = Dispatch.objects.get_or_create(dispatch_id="D-10242", defaults={
            "timestamp": ts, "unit":u2, "dispatcher":"J. Smith", "call_type":"Non-Emergency", "location":"City ER", "status":"En Route"
        })
        # trips
        t1, _ = Trip.objects.get_or_create(trip_id="T-7751", defaults={
            "dispatch": d1, "unit": u1, "crew":"Paramedic Lewis, EMT Clark", "patient_id":"P-45120", "pickup_location":"45 Elm St.", "destination":"General Hospital", "status":"Completed"
        })
        return {"units": [u1.id, u2.id, u3.id], "dispatches":[d1.id,d2.id], "trips":[t1.id]}
    res = await sync_to_async(seed_sync)()
    return res

# -----------------------
# Ambulance Unit Endpoints
# -----------------------
@router.get("/units", response_model=List[AmbulanceUnitResponse])
async def list_units(skip: int = 0, limit: int = 50, in_service: Optional[bool] = None):
    def q():
        qs = AmbulanceUnit.objects.all()
        if in_service is not None:
            qs = qs.filter(in_service=in_service)
        return list(qs[skip:skip+limit])
    items = await sync_to_async(q)()
    return [AmbulanceUnitResponse(
        id=u.id,
        unit_number=u.unit_number,
        vehicle_make=u.vehicle_make,
        vehicle_model=u.vehicle_model,
        in_service=u.in_service,
        notes=u.notes,
        created_at=u.created_at
    ) for u in items]

@router.post("/units", response_model=AmbulanceUnitResponse, status_code=201)
async def create_unit(payload: AmbulanceUnitCreate):
    def create_sync():
        u = AmbulanceUnit.objects.create(
            unit_number=payload.unit_number,
            vehicle_make=payload.vehicle_make,
            vehicle_model=payload.vehicle_model,
            in_service=payload.in_service,
            notes=payload.notes
        )
        return u
    unit = await sync_to_async(create_sync)()
    return AmbulanceUnitResponse(
        id=unit.id,
        unit_number=unit.unit_number,
        vehicle_make=unit.vehicle_make,
        vehicle_model=unit.vehicle_model,
        in_service=unit.in_service,
        notes=unit.notes,
        created_at=unit.created_at
    )

@router.get("/units/{unit_id}", response_model=AmbulanceUnitResponse)
async def get_unit(unit_id: int):
    def get_sync():
        return AmbulanceUnit.objects.get(id=unit_id)
    try:
        u = await sync_to_async(get_sync)()
        return AmbulanceUnitResponse(
            id=u.id,
            unit_number=u.unit_number,
            vehicle_make=u.vehicle_make,
            vehicle_model=u.vehicle_model,
            in_service=u.in_service,
            notes=u.notes,
            created_at=u.created_at
        )
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.put("/units/{unit_id}", response_model=AmbulanceUnitResponse)
async def update_unit(unit_id: int, payload: AmbulanceUnitCreate):
    def update_sync():
        u = AmbulanceUnit.objects.get(id=unit_id)
        u.unit_number = payload.unit_number
        u.vehicle_make = payload.vehicle_make
        u.vehicle_model = payload.vehicle_model
        u.in_service = payload.in_service
        u.notes = payload.notes
        u.save()
        return u
    try:
        u = await sync_to_async(update_sync)()
        return AmbulanceUnitResponse(
            id=u.id,
            unit_number=u.unit_number,
            vehicle_make=u.vehicle_make,
            vehicle_model=u.vehicle_model,
            in_service=u.in_service,
            notes=u.notes,
            created_at=u.created_at
        )
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/units/{unit_id}", status_code=204)
async def delete_unit(unit_id: int):
    def delete_sync():
        u = AmbulanceUnit.objects.get(id=unit_id)
        u.delete()
    try:
        await sync_to_async(delete_sync)()
        return None
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")


# -----------------------
# Dispatch Endpoints
# -----------------------
@router.get("/dispatch", response_model=List[DispatchResponse])
async def list_dispatches(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20
):
    def q():
        qs = Dispatch.objects.select_related("unit").all()
        if search:
            qs = qs.filter(
                models.Q(dispatch_id__icontains=search) |
                models.Q(dispatcher__icontains=search) |
                models.Q(location__icontains=search) |
                models.Q(unit__unit_number__icontains=search)
            )
        if status:
            qs = qs.filter(status=status)
        return list(qs[skip:skip+limit])
    # Import models inside function to avoid top-level Django query evaluation in async context
    import django.db.models as models
    items = await sync_to_async(q)()
    return [await DispatchResponse.from_orm_with_unit(d) for d in items]

@router.post("/dispatch", response_model=DispatchResponse, status_code=201)
async def create_dispatch(payload: DispatchCreate):
    def create_sync():
        unit = None
        if payload.unit_id:
            unit = AmbulanceUnit.objects.get(id=payload.unit_id)
        d = Dispatch.objects.create(
            dispatch_id=payload.dispatch_id,
            timestamp=payload.timestamp,
            unit=unit,
            dispatcher=payload.dispatcher,
            call_type=payload.call_type,
            location=payload.location,
            status=payload.status,
        )
        return d
    try:
        d = await sync_to_async(create_sync)()
        return await DispatchResponse.from_orm_with_unit(d)
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")
    except Exception as e:
        raise HTTPException(400, str(e))

@router.get("/dispatch/{dispatch_id}", response_model=DispatchResponse)
async def get_dispatch(dispatch_id: int):
    def get_sync():
        return Dispatch.objects.select_related("unit").get(id=dispatch_id)
    try:
        d = await sync_to_async(get_sync)()
        return await DispatchResponse.from_orm_with_unit(d)
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")

@router.put("/dispatch/{dispatch_id}", response_model=DispatchResponse)
async def update_dispatch(dispatch_id: int, payload: DispatchUpdate):
    def update_sync():
        d = Dispatch.objects.get(id=dispatch_id)
        if payload.unit_id:
            d.unit = AmbulanceUnit.objects.get(id=payload.unit_id)
        else:
            d.unit = None
        d.timestamp = payload.timestamp
        d.dispatcher = payload.dispatcher
        d.call_type = payload.call_type
        d.location = payload.location
        d.status = payload.status
        d.save()
        return d
    try:
        d = await sync_to_async(update_sync)()
        return await DispatchResponse.from_orm_with_unit(d)
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/dispatch/{dispatch_id}", status_code=204)
async def delete_dispatch(dispatch_id: int):
    def delete_sync():
        d = Dispatch.objects.get(id=dispatch_id)
        d.delete()
    try:
        await sync_to_async(delete_sync)()
        return None
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")


# -----------------------
# Trip Endpoints
# -----------------------
@router.get("/trips", response_model=List[TripResponse])
async def list_trips(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20
):
    def q():
        qs = Trip.objects.select_related("dispatch", "unit").all()
        if search:
            qs = qs.filter(
                models.Q(trip_id__icontains=search) |
                models.Q(dispatch__dispatch_id__icontains=search) |
                models.Q(unit__unit_number__icontains=search) |
                models.Q(patient_id__icontains=search)
            )
        if status:
            qs = qs.filter(status=status)
        return list(qs[skip:skip+limit])
    import django.db.models as models
    items = await sync_to_async(q)()
    return [await TripResponse.from_orm_with_details(t) for t in items]

@router.post("/trips", response_model=TripResponse, status_code=201)
async def create_trip(payload: TripCreate):
    def create_sync():
        dispatch_obj = None
        unit_obj = None
        if payload.dispatch_id:
            dispatch_obj = Dispatch.objects.get(id=payload.dispatch_id)
        if payload.unit_id:
            unit_obj = AmbulanceUnit.objects.get(id=payload.unit_id)
        t = Trip.objects.create(
            trip_id=payload.trip_id,
            dispatch=dispatch_obj,
            unit=unit_obj,
            crew=payload.crew,
            patient_id=payload.patient_id,
            pickup_location=payload.pickup_location,
            destination=payload.destination,
            start_time=payload.start_time,
            end_time=payload.end_time,
            mileage=payload.mileage,
            status=payload.status,
            notes=payload.notes
        )
        return t
    try:
        t = await sync_to_async(create_sync)()
        return await TripResponse.from_orm_with_details(t)
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.get("/trips/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: int):
    def get_sync():
        return Trip.objects.select_related("dispatch", "unit").get(id=trip_id)
    try:
        t = await sync_to_async(get_sync)()
        return await TripResponse.from_orm_with_details(t)
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")

@router.put("/trips/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: int, payload: TripUpdate):
    def update_sync():
        t = Trip.objects.get(id=trip_id)
        if payload.dispatch_id:
            t.dispatch = Dispatch.objects.get(id=payload.dispatch_id)
        else:
            t.dispatch = None
        if payload.unit_id:
            t.unit = AmbulanceUnit.objects.get(id=payload.unit_id)
        else:
            t.unit = None
        t.crew = payload.crew
        t.patient_id = payload.patient_id
        t.pickup_location = payload.pickup_location
        t.destination = payload.destination
        t.start_time = payload.start_time
        t.end_time = payload.end_time
        t.mileage = payload.mileage
        t.status = payload.status
        t.notes = payload.notes
        t.save()
        return t
    try:
        t = await sync_to_async(update_sync)()
        return await TripResponse.from_orm_with_details(t)
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/trips/{trip_id}", status_code=204)
async def delete_trip(trip_id: int):
    def delete_sync():
        t = Trip.objects.get(id=trip_id)
        t.delete()
    try:
        await sync_to_async(delete_sync)()
        return None
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")
