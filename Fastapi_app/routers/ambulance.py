# fastapi_app/routers/ambulance_router.py

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from asgiref.sync import sync_to_async
import random
import asyncio

# Django Models
from HMS_backend.models import AmbulanceUnit, Dispatch, Trip, Patient

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

router = APIRouter(prefix="/ambulance", tags=["Ambulance Management"])

notify_clients = None

def set_notify_clients(notify_func):
    """Set the notify_clients function from main.py"""
    global notify_clients
    notify_clients = notify_func

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

async def simulate_live_gps(trip_id: int, unit_number: str):
    """Simulate live GPS tracking for a trip"""
    if notify_clients is None:
        print("⚠️ notify_clients not available for GPS simulation")
        return
        
    # Start with coordinates near Delhi
    lat = 28.6139 + (random.random() - 0.5) * 0.1
    lng = 77.2090 + (random.random() - 0.5) * 0.1

    # Simulate movement for ~4 minutes
    for i in range(50):
        # Small random movement
        lat += (random.random() - 0.5) * 0.002
        lng += (random.random() - 0.5) * 0.002

        # Send location update
        await notify_clients(
            "location_update",
            trip_id=trip_id,
            unit_number=unit_number,
            lat=round(lat, 6),
            lng=round(lng, 6),
            status="En Route"
        )
        await asyncio.sleep(5)  # Update every 5 seconds

    # Trip completed
    await notify_clients(
        "status_update",
        title="Trip Completed",
        message=f"Ambulance {unit_number} has arrived at destination",
        trip_id=trip_id,
        unit_number=unit_number
    )

# ==============================================
# Safe Async Delete Helper
# ==============================================
async def safe_delete(model, obj_id: int, name: str):
    deleted = await sync_to_async(lambda: (ensure_db_connection(), model.objects.filter(id=obj_id).delete())[1])()
    if deleted[0] == 0:
        raise HTTPException(status_code=404, detail=f"{name} not found")
    return deleted

# ==============================================
# Notification Helper Functions
# ==============================================
async def notify_unit_created(unit_data: AmbulanceUnitResponse):
    """Notify when a new ambulance unit is created"""
    if notify_clients:
        await notify_clients(
            "unit_created",
            title="New Ambulance Unit Added",
            message=f"Ambulance {unit_data.unit_number} has been added to the fleet",
            unit_id=unit_data.id,
            unit_number=unit_data.unit_number,
            vehicle_make=unit_data.vehicle_make,
            vehicle_model=unit_data.vehicle_model,
            in_service=unit_data.in_service
        )

async def notify_unit_updated(unit_data: AmbulanceUnitResponse):
    """Notify when an ambulance unit is updated"""
    if notify_clients:
        await notify_clients(
            "unit_updated",
            title="Ambulance Unit Updated",
            message=f"Ambulance {unit_data.unit_number} details have been updated",
            unit_id=unit_data.id,
            unit_number=unit_data.unit_number,
            in_service=unit_data.in_service
        )

async def notify_unit_deleted(unit_id: int, unit_number: str):
    """Notify when an ambulance unit is deleted"""
    if notify_clients:
        await notify_clients(
            "unit_deleted",
            title="Ambulance Unit Removed",
            message=f"Ambulance {unit_number} has been removed from the fleet",
            unit_id=unit_id,
            unit_number=unit_number
        )

async def notify_dispatch_created(dispatch_data: DispatchResponse):
    """Notify when a new dispatch is created"""
    if notify_clients:
        unit_info = f" - Unit {dispatch_data.unit.unit_number}" if dispatch_data.unit else ""
        await notify_clients(
            "dispatch_created",
            title="New Dispatch Created",
            message=f"Dispatch {dispatch_data.dispatch_id} created for {dispatch_data.location}{unit_info}",
            dispatch_id=dispatch_data.dispatch_id,
            location=dispatch_data.location,
            unit_number=dispatch_data.unit.unit_number if dispatch_data.unit else None,
            status=dispatch_data.status
        )

async def notify_dispatch_updated(dispatch_data: DispatchResponse):
    """Notify when a dispatch is updated"""
    if notify_clients:
        await notify_clients(
            "dispatch_updated",
            title="Dispatch Updated",
            message=f"Dispatch {dispatch_data.dispatch_id} has been updated",
            dispatch_id=dispatch_data.dispatch_id,
            status=dispatch_data.status,
            location=dispatch_data.location
        )

async def notify_dispatch_deleted(dispatch_id: int, dispatch_id_str: str):
    """Notify when a dispatch is deleted"""
    if notify_clients:
        await notify_clients(
            "dispatch_deleted",
            title="Dispatch Cancelled",
            message=f"Dispatch {dispatch_id_str} has been cancelled",
            dispatch_id=dispatch_id_str
        )

async def notify_trip_created(trip_data: TripResponse):
    """Notify when a new trip is created"""
    if notify_clients:
        unit_number = trip_data.unit.unit_number if trip_data.unit else "Unknown Unit"
        await notify_clients(
            "trip_created",
            title="New Trip Started",
            message=f"Trip {trip_data.trip_id} started for {unit_number}",
            trip_id=trip_data.trip_id,
            unit_number=unit_number,
            status=trip_data.status,
            destination=trip_data.destination
        )
        
        # Start GPS simulation for new trips
        if trip_data.status == "En Route" and trip_data.unit:
            asyncio.create_task(simulate_live_gps(trip_data.id, unit_number))

async def notify_trip_updated(trip_data: TripResponse):
    """Notify when a trip is updated"""
    if notify_clients:
        unit_number = trip_data.unit.unit_number if trip_data.unit else "Unknown Unit"
        await notify_clients(
            "trip_updated",
            title="Trip Status Updated",
            message=f"Trip {trip_data.trip_id} status changed to {trip_data.status}",
            trip_id=trip_data.trip_id,
            unit_number=unit_number,
            status=trip_data.status
        )
        
        # Start GPS simulation if trip status changed to "En Route"
        if trip_data.status == "En Route" and trip_data.unit:
            asyncio.create_task(simulate_live_gps(trip_data.id, unit_number))

async def notify_trip_deleted(trip_id: int, trip_id_str: str, unit_number: str = None):
    """Notify when a trip is deleted"""
    if notify_clients:
        await notify_clients(
            "trip_deleted",
            title="Trip Cancelled",
            message=f"Trip {trip_id_str} has been cancelled{' by ' + unit_number if unit_number else ''}",
            trip_id=trip_id_str,
            unit_number=unit_number
        )

# ==============================================
# Ambulance Units
# ==============================================
@router.get("/units", response_model=List[AmbulanceUnitResponse])
async def list_units(in_service: Optional[bool] = None):
    qs = AmbulanceUnit.objects.all()
    if in_service is not None:
        qs = qs.filter(in_service=in_service)
    return await sync_to_async(lambda: (ensure_db_connection(), list(qs.order_by("-id")))[1])()

@router.post("/units", response_model=AmbulanceUnitResponse, status_code=201)
async def create_unit(payload: AmbulanceUnitCreate):
    unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.create(**payload.dict()))[1])()
    unit_response = AmbulanceUnitResponse.from_orm(unit)
    
    # Notify about unit creation
    await notify_unit_created(unit_response)
    
    return unit_response

@router.put("/units/{unit_id}", response_model=AmbulanceUnitResponse)
async def update_unit(unit_id: int, payload: AmbulanceUnitCreate):
    try:
        unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.get(id=unit_id))[1])()
        for k, v in payload.dict().items():
            setattr(unit, k, v)
        await sync_to_async(lambda: (ensure_db_connection(), unit.save())[1])()
        
        unit_response = AmbulanceUnitResponse.from_orm(unit)
        
        # Notify about unit update
        await notify_unit_updated(unit_response)
        
        return unit_response
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/units/{unit_id}", status_code=204)
async def delete_unit(unit_id: int):
    # Get unit info before deletion for notification
    try:
        unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.get(id=unit_id))[1])()
        unit_number = unit.unit_number
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")
    
    await safe_delete(AmbulanceUnit, unit_id, "Unit")
    
    # Notify about unit deletion
    await notify_unit_deleted(unit_id, unit_number)

# ==============================================
# Dispatch Endpoints
# ==============================================
@router.get("/dispatch", response_model=List[DispatchResponse])
async def list_dispatches():
    dispatches = await sync_to_async(lambda: (ensure_db_connection(), list(
        Dispatch.objects.select_related("unit").all().order_by("-timestamp")
    ))[1])()
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
    unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.get(id=payload.unit_id))[1])() if payload.unit_id else None
    dispatch = await sync_to_async(lambda: (ensure_db_connection(), Dispatch.objects.create(
        timestamp=payload.timestamp, unit=unit, dispatcher=payload.dispatcher,
        call_type=payload.call_type or "Emergency", location=payload.location,
        status=payload.status or "Standby"
    ))[1])()
    unit_resp = AmbulanceUnitResponse.from_orm(unit) if unit else None
    dispatch_response = DispatchResponse(
        id=dispatch.id, dispatch_id=dispatch.dispatch_id, timestamp=dispatch.timestamp,
        unit_id=unit.id if unit else None, unit=unit_resp,
        dispatcher=dispatch.dispatcher, call_type=dispatch.call_type,
        location=dispatch.location, status=dispatch.status
    )
    
    # Notify about dispatch creation
    await notify_dispatch_created(dispatch_response)
    
    return dispatch_response

@router.put("/dispatch/{dispatch_id}", response_model=DispatchResponse)
async def update_dispatch(dispatch_id: int, payload: DispatchUpdate):
    try:
        d = await sync_to_async(lambda: (ensure_db_connection(), Dispatch.objects.get(id=dispatch_id))[1])()
        if payload.timestamp is not None: d.timestamp = payload.timestamp
        if payload.dispatcher is not None: d.dispatcher = payload.dispatcher
        if payload.call_type is not None: d.call_type = payload.call_type
        if payload.location is not None: d.location = payload.location
        if payload.status is not None: d.status = payload.status
        if payload.unit_id is not None:
            d.unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.get(id=payload.unit_id))[1])() if payload.unit_id else None
        await sync_to_async(lambda: (ensure_db_connection(), d.save())[1])()
        unit_resp = AmbulanceUnitResponse.from_orm(d.unit) if d.unit else None
        dispatch_response = DispatchResponse(
            id=d.id, dispatch_id=d.dispatch_id, timestamp=d.timestamp,
            unit_id=d.unit.id if d.unit else None, unit=unit_resp,
            dispatcher=d.dispatcher, call_type=d.call_type,
            location=d.location, status=d.status
        )
        
        # Notify about dispatch update
        await notify_dispatch_updated(dispatch_response)
        
        return dispatch_response
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")
    except AmbulanceUnit.DoesNotExist:
        raise HTTPException(404, "Unit not found")

@router.delete("/dispatch/{dispatch_id}", status_code=204)
async def delete_dispatch(dispatch_id: int):
    # Get dispatch info before deletion for notification
    try:
        dispatch = await sync_to_async(lambda: (ensure_db_connection(), Dispatch.objects.get(id=dispatch_id))[1])()
        dispatch_id_str = dispatch.dispatch_id
    except Dispatch.DoesNotExist:
        raise HTTPException(404, "Dispatch not found")
    
    # CASCADE delete → all related Trips will be automatically deleted
    await safe_delete(Dispatch, dispatch_id, "Dispatch")
    
    # Notify about dispatch deletion
    await notify_dispatch_deleted(dispatch_id, dispatch_id_str)

# ==============================================
# Trip Endpoints – FULLY FIXED
# ==============================================
@router.get("/trips", response_model=List[TripResponse])
async def list_trips():
    trips = await sync_to_async(lambda: (ensure_db_connection(), list(
        Trip.objects.select_related("dispatch__unit", "unit", "patient").all().order_by("-created_at")
    ))[1])()
    result = []
    for t in trips:
        dispatch_resp = None
        if t.dispatch:
            unit_d = await sync_to_async(lambda: (ensure_db_connection(), t.dispatch.unit)[1])()
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
            dispatch = await sync_to_async(lambda: (ensure_db_connection(), Dispatch.objects.select_related("unit").get(id=payload.dispatch_id))[1])()

        unit = None
        if payload.unit_id:
            unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.get(id=payload.unit_id))[1])()

        patient = None
        if payload.patient_id:
            patient = await sync_to_async(lambda: (ensure_db_connection(), Patient.objects.get(id=payload.patient_id))[1])()

        # Create trip
        trip = await sync_to_async(lambda: (ensure_db_connection(), Trip.objects.create(
            dispatch=dispatch, unit=unit, patient=patient,
            crew=payload.crew, pickup_location=payload.pickup_location,
            destination=payload.destination, start_time=payload.start_time,
            end_time=payload.end_time, mileage=payload.mileage,
            status=payload.status or "Standby", notes=payload.notes
        ))[1])()

        # Build nested dispatch response safely
        dispatch_resp = None
        if dispatch:
            unit_d = await sync_to_async(lambda: (ensure_db_connection(), dispatch.unit)[1])()
            unit_d_resp = AmbulanceUnitResponse.from_orm(unit_d) if unit_d else None
            dispatch_resp = DispatchResponse(
                id=dispatch.id, dispatch_id=dispatch.dispatch_id,
                timestamp=dispatch.timestamp, unit_id=unit_d.id if unit_d else None,
                unit=unit_d_resp, dispatcher=dispatch.dispatcher,
                call_type=dispatch.call_type, location=dispatch.location,
                status=dispatch.status
            )

        trip_response = TripResponse(
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

        # Notify about trip creation
        await notify_trip_created(trip_response)

        return trip_response

    except (Dispatch.DoesNotExist, AmbulanceUnit.DoesNotExist, Patient.DoesNotExist):
        raise HTTPException(404, "Related record not found")

@router.put("/trips/{trip_id}", response_model=TripResponse)
async def update_trip(trip_id: int, payload: TripUpdate):
    try:
        t = await sync_to_async(lambda: (ensure_db_connection(), Trip.objects.get(id=trip_id))[1])()
        if payload.dispatch_id is not None:
            t.dispatch = await sync_to_async(lambda: (ensure_db_connection(), Dispatch.objects.get(id=payload.dispatch_id))[1])() if payload.dispatch_id else None
        if payload.unit_id is not None:
            t.unit = await sync_to_async(lambda: (ensure_db_connection(), AmbulanceUnit.objects.get(id=payload.unit_id))[1])() if payload.unit_id else None
        if payload.patient_id is not None:
            t.patient = await sync_to_async(lambda: (ensure_db_connection(), Patient.objects.get(id=payload.patient_id))[1])() if payload.patient_id else None
        if payload.crew is not None: t.crew = payload.crew
        if payload.pickup_location is not None: t.pickup_location = payload.pickup_location
        if payload.destination is not None: t.destination = payload.destination
        if payload.start_time is not None: t.start_time = payload.start_time
        if payload.end_time is not None: t.end_time = payload.end_time
        if payload.mileage is not None: t.mileage = payload.mileage
        if payload.status is not None: t.status = payload.status
        if payload.notes is not None: t.notes = payload.notes
        await sync_to_async(lambda: (ensure_db_connection(), t.save())[1])()

        # Build response
        dispatch_resp = None
        if t.dispatch:
            unit_d = await sync_to_async(lambda: (ensure_db_connection(), t.dispatch.unit)[1])()
            unit_d_resp = AmbulanceUnitResponse.from_orm(unit_d) if unit_d else None
            dispatch_resp = DispatchResponse(
                id=t.dispatch.id, dispatch_id=t.dispatch.dispatch_id,
                timestamp=t.dispatch.timestamp, unit_id=unit_d.id if unit_d else None,
                unit=unit_d_resp, dispatcher=t.dispatch.dispatcher,
                call_type=t.dispatch.call_type, location=t.dispatch.location,
                status=t.dispatch.status
            )

        trip_response = TripResponse(
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

        # Notify about trip update
        await notify_trip_updated(trip_response)

        return trip_response
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")
    except (Dispatch.DoesNotExist, AmbulanceUnit.DoesNotExist, Patient.DoesNotExist):
        raise HTTPException(404, "Related record not found")

@router.delete("/trips/{trip_id}", status_code=204)
async def delete_trip(trip_id: int):
    # Get trip info before deletion for notification
    try:
        trip = await sync_to_async(lambda: (ensure_db_connection(), Trip.objects.select_related("unit").get(id=trip_id))[1])()
        trip_id_str = trip.trip_id
        unit_number = trip.unit.unit_number if trip.unit else None
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")
    
    await safe_delete(Trip, trip_id, "Trip")
    
    # Notify about trip deletion
    await notify_trip_deleted(trip_id, trip_id_str, unit_number)

# ==============================================
# Patients Dropdown
# ==============================================
@router.get("/patients", response_model=List[dict])
async def get_patients_for_dropdown():
    patients = await sync_to_async(lambda: (ensure_db_connection(), list(
        Patient.objects.values("id", "patient_unique_id", "full_name")
        .order_by("patient_unique_id")[:500]
    ))[1])()
    return [
        {"id": p["id"], "patient_unique_id": p["patient_unique_id"], "full_name": p["full_name"]}
        for p in patients
    ]

# ==============================================
# Trip Status Update Endpoint
# ==============================================
@router.patch("/trips/{trip_id}/status", response_model=TripResponse)
async def update_trip_status(trip_id: int, status: str):
    """Update trip status and notify clients"""
    try:
        trip = await sync_to_async(lambda: (ensure_db_connection(), Trip.objects.select_related("unit").get(id=trip_id))[1])()
        old_status = trip.status
        trip.status = status
        await sync_to_async(lambda: (ensure_db_connection(), trip.save())[1])()

        # Build response
        dispatch_resp = None
        if trip.dispatch:
            unit_d = await sync_to_async(lambda: (ensure_db_connection(), trip.dispatch.unit)[1])()
            unit_d_resp = AmbulanceUnitResponse.from_orm(unit_d) if unit_d else None
            dispatch_resp = DispatchResponse(
                id=trip.dispatch.id, dispatch_id=trip.dispatch.dispatch_id,
                timestamp=trip.dispatch.timestamp, unit_id=unit_d.id if unit_d else None,
                unit=unit_d_resp, dispatcher=trip.dispatch.dispatcher,
                call_type=trip.dispatch.call_type, location=trip.dispatch.location,
                status=trip.dispatch.status
            )

        trip_response = TripResponse(
            id=trip.id, trip_id=trip.trip_id, created_at=trip.created_at,
            dispatch=dispatch_resp, dispatch_id=trip.dispatch.id if trip.dispatch else None,
            unit=AmbulanceUnitResponse.from_orm(trip.unit) if trip.unit else None,
            unit_id=trip.unit.id if trip.unit else None,
            patient=PatientRef.from_orm(trip.patient) if trip.patient else None,
            patient_id=trip.patient.id if trip.patient else None,
            crew=trip.crew, pickup_location=trip.pickup_location,
            destination=trip.destination, start_time=trip.start_time,
            end_time=trip.end_time, mileage=trip.mileage,
            status=trip.status, notes=trip.notes
        )

        # Notify about status change
        if notify_clients:
            unit_number = trip.unit.unit_number if trip.unit else "Unknown Unit"
            await notify_clients(
                "trip_status_changed",
                title="Trip Status Updated",
                message=f"Trip {trip.trip_id} changed from {old_status} to {status}",
                trip_id=trip.trip_id,
                unit_number=unit_number,
                old_status=old_status,
                new_status=status
            )

            # Start GPS simulation if status changed to "En Route"
            if status == "En Route" and trip.unit:
                asyncio.create_task(simulate_live_gps(trip.id, unit_number))

        return trip_response
    except Trip.DoesNotExist:
        raise HTTPException(404, "Trip not found")