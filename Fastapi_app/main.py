
import fastapi_app.django_setup  # <-- sets DJANGO_SETTINGS_MODULE & calls django.setup()
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import json
from typing import List, Dict, Any
from datetime import datetime
import asyncio

# ----------------------------------------------------------------
# Import routers **after** Django is ready
# ----------------------------------------------------------------
from fastapi_app.routers import (
    department, appointments, staff, new_registration, add_bloodgroup,
    blood_donor, labreport, bed_group_list, staffmanagement, payroll,
    attendance, stock, ambulance, billing, auth, security,
    user_management, user_profile, medicine_allocation,
    pharmacybilling, invoice_generator, invoice_pharmacy_billing,
)



# ----------------------------------------------------------------
# WebSocket Connection Manager
# ----------------------------------------------------------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_data: Dict[WebSocket, Dict[str, Any]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_data[websocket] = {
            "connected_at": datetime.now(),
            "client_info": None
        }
        print(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_data:
            del self.connection_data[websocket]
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending message to client: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        if not self.active_connections:
            return
            
        message_str = json.dumps(message, default=str, ensure_ascii=False)
        disconnected = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                disconnected.append(connection)
                
        for connection in disconnected:
            self.disconnect(connection)

# Global WebSocket manager
manager = ConnectionManager()

# Global notifier function
async def notify_clients(event_type: str, **data):
    """Helper function to broadcast notifications to all connected clients"""
    payload = {
        "type": event_type,
        "timestamp": datetime.now().isoformat(),
        **data
    }
    await manager.broadcast(payload)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Ambulance Management API...")
    yield
    # Shutdown
    print("Shutting down Ambulance Management API...")

# ----------------------------------------------------------------
# FastAPI app
# ----------------------------------------------------------------
app = FastAPI(
    title="Hospital Management System API",
    description="Comprehensive HMS with real-time ambulance tracking",
    version="1.0.0",
    lifespan=lifespan
)

# ==================== CORS ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
PROFILE_PIC_DIR = os.path.abspath("profile_pictures")
os.makedirs(PROFILE_PIC_DIR, exist_ok=True)

STAFF_PIC_DIR = os.path.abspath("fastapi_app/staffs_pictures")
os.makedirs(STAFF_PIC_DIR, exist_ok=True)

app.mount(
    "/fastapi_app/staffs_pictures",
    StaticFiles(directory=STAFF_PIC_DIR),
    name="staffs_pictures",
)

# ---------- STAFF DOCUMENTS / CERTIFICATES ----------
STAFF_DOC_DIR = os.path.abspath("fastapi_app/Staff_documents")
os.makedirs(STAFF_DOC_DIR, exist_ok=True)

app.mount(
    "/staff_documents",
    StaticFiles(directory=STAFF_DOC_DIR),
    name="staff_documents",
)

app.mount(
    "/profile_pictures",
    StaticFiles(directory=PROFILE_PIC_DIR),
    name="profile_pictures",
)
app.mount("/static/patient_photos", StaticFiles(directory="fastapi_app/Patient_photos"), name="patient_photos")

# ==================== HEALTH CHECK ====================
@app.get("/health")
async def health():
    return {"status": "ok", "message": "FastAPI + Django ready"}
# ==================== STATIC FILES ====================
# Serve uploaded profile pictures


# Serve patient photos
PATIENT_PHOTOS_DIR = os.path.abspath("fastapi_app/Patient_photos")
os.makedirs(PATIENT_PHOTOS_DIR, exist_ok=True)
app.mount(
    "/static/patient_photos", 
    StaticFiles(directory=PATIENT_PHOTOS_DIR), 
    name="patient_photos"
)

# ==================== HEALTH CHECK ====================
@app.get("/")
async def root():
    return {
        "message": "Hospital Management System API",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "HMS FastAPI",
        "timestamp": datetime.now().isoformat(),
        "websocket_connections": len(manager.active_connections)
    }

@app.get("/ws-status")
async def websocket_status():
    return {
        "active_connections": len(manager.active_connections),
        "connections": [
            {
                "connected_at": data["connected_at"].isoformat(),
                "client_info": data["client_info"]
            }
            for data in manager.connection_data.values()
        ]
    }

# ==================== WEBSOCKET ENDPOINT ====================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send connection confirmation
        await manager.send_personal_message(
            json.dumps({
                "type": "connection_established",
                "message": "Connected to real-time ambulance updates",
                "timestamp": datetime.now().isoformat(),
                "connection_id": id(websocket)
            }),
            websocket
        )
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            # Optional: handle client messages
            try:
                client_data = json.loads(data)
                if client_data.get("type") == "client_info":
                    manager.connection_data[websocket]["client_info"] = client_data
            except:
                pass  # Ignore invalid messages
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# ==================== ROUTERS ====================
app.include_router(department.router)
app.include_router(appointments.router)
app.include_router(staff.router)
app.include_router(new_registration.router)
app.include_router(add_bloodgroup.router)
app.include_router(blood_donor.router)
app.include_router(labreport.router)
app.include_router(bed_group_list.router)
app.include_router(staffmanagement.router)
app.include_router(payroll.router)
app.include_router(attendance.router)
app.include_router(stock.router)
ambulance.set_notify_clients(notify_clients)
app.include_router(ambulance.router)
app.include_router(billing.router)
app.include_router(auth.router)
app.include_router(security.router)
app.include_router(user_management.router)
app.include_router(user_profile.router)
app.include_router(medicine_allocation.router)
app.include_router(pharmacybilling.router)
app.include_router(invoice_generator.router)
app.include_router(invoice_pharmacy_billing.router)

# Make notify_clients available to routers
app.state.notify_clients = notify_clients

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
