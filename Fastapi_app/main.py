
# # main.py

# from pathlib import Path
# import Fastapi_app.django_setup  # <-- sets DJANGO_SETTINGS_MODULE & calls django.setup()
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from contextlib import asynccontextmanager
# import os
# import json
# from typing import List, Dict, Any
# from datetime import datetime
# import asyncio
# from django.db import close_old_connections
# from fastapi import FastAPI, Request
# from dotenv import load_dotenv
# import os

# load_dotenv()

# # Import WebSocket service
# from Fastapi_app.services.websocket_service import manager, notify_clients

# # ----------------------------------------------------------------
# # Import routers **after** Django is ready
# # ----------------------------------------------------------------
# from Fastapi_app.routers import (
#     department, appointments, staff, new_registration, add_bloodgroup,
#     blood_donor, labreport, bed_group_list, staffmanagement, payroll,
#     attendance, stock, ambulance, billing, auth, security,
#     user_management, user_profile, medicine_allocation,
#     pharmacybilling, invoice_generator, notifications, invoice_pharmacy_billing, hospital_billing,
#     dashboard, treatment_charges, laboratory, surgery, settings, charges
# )

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Startup
#     print("Starting Hospital Management System API...")
#     yield
#     # Shutdown
#     print("Shutting down Hospital Management System API...")

# # ----------------------------------------------------------------
# # FastAPI app
# # ----------------------------------------------------------------
# app = FastAPI(
#     title="Hospital Management System API",
#     description="Comprehensive HMS with real-time notifications",
#     version="1.0.0",
#     lifespan=lifespan
# )


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[            # if you later add https
#         "http://localhost:5173",              # dev - vite
#         "http://127.0.0.1:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
#     allow_headers=[
#         "Content-Type",
#         "Authorization",
#         "Accept",
#         "X-Requested-With",
#         "Set-Cookie",
#         "Cookie",
#     ],
#     expose_headers=["Set-Cookie", "Authorization"],
#     max_age=86400,  # 24 hours
# )

# # ==================== STATIC FILES ====================
# PROFILE_PIC_DIR = os.path.abspath("profile_pictures")
# os.makedirs(PROFILE_PIC_DIR, exist_ok=True)
# app.mount(
#     "/profile_pictures",
#     StaticFiles(directory=PROFILE_PIC_DIR),
#     name="profile_pictures",
# )

# PATIENT_PHOTOS_DIR = os.path.abspath("Fastapi_app/Patient_photos")
# os.makedirs(PATIENT_PHOTOS_DIR, exist_ok=True)
# app.mount(
#     "/static/patient_photos", 
#     StaticFiles(directory=PATIENT_PHOTOS_DIR), 
#     name="patient_photos"
# )

# STAFF_PICTURES_DIR = os.path.abspath("Fastapi_app/staffs_pictures")
# os.makedirs(STAFF_PICTURES_DIR, exist_ok=True)
# app.mount(
#     "/static/staffs_pictures",
#     StaticFiles(directory=STAFF_PICTURES_DIR),
#     name="staffs_pictures"
# )
# INVOICE_DIR = os.path.abspath("Fastapi_app/pharmacy/invoices")
# os.makedirs(INVOICE_DIR, exist_ok=True)

# app.mount("/invoices", StaticFiles(directory=INVOICE_DIR), name="invoices")

# HOSPITALBILLING_DIR = os.path.abspath("Fastapi_app/invoices_generator")
# os.makedirs(HOSPITALBILLING_DIR, exist_ok=True)

# # Mount the static files directory so invoices can be served/downloaded
# app.mount("/invoices_generator", StaticFiles(directory=HOSPITALBILLING_DIR), name="invoices_generator")
# app.mount("/Fastapi_app/Staff_documents", StaticFiles(directory="Fastapi_app/Staff_documents"), name="staff_docs")

# app.mount("/uploads", StaticFiles(directory="Fastapi_app/uploads"), name="uploads")

# BASE_DIR = Path(__file__).resolve().parent.parent
# media_dir = BASE_DIR / "media"
# media_dir.mkdir(exist_ok=True)
# (media_dir / "hospital_logo").mkdir(exist_ok=True)

# # Mount static files
# app.mount("/media", StaticFiles(directory=str(media_dir)), name="media")

# # ==================== HEALTH CHECK ====================
# @app.get("/")
# async def root():
#     return {
#         "message": "Hospital Management System API",
#         "status": "running",
#         "timestamp": datetime.now().isoformat(),
#         "version": "1.0.0"
#     }

# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "service": "HMS FastAPI",
#         "timestamp": datetime.now().isoformat(),
#         "websocket_connections": len(manager.active_connections)
#     }

# @app.get("/ws-status")
# async def websocket_status():
#     return {
#         "active_connections": len(manager.active_connections),
#         "connections": [
#             {
#                 "connected_at": data["connected_at"].isoformat(),
#                 "client_info": data["client_info"]
#             }
#             for data in manager.connection_data.values()
#         ]
#     }
# @app.middleware("http")
# async def django_db_lifecycle(request: Request, call_next):
#     close_old_connections()
#     response = await call_next(request)
#     close_old_connections()
#     return response
# # ==================== WEBSOCKET ENDPOINT ====================
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await manager.connect(websocket)
#     try:
#         # Send connection confirmation
#         await manager.send_personal_message(
#             json.dumps({
#                 "type": "connection_established",
#                 "message": "Connected to real-time notifications",
#                 "timestamp": datetime.now().isoformat(),
#                 "connection_id": id(websocket)
#             }),
#             websocket
#         )
        
#         # Keep connection alive
#         while True:
#             data = await websocket.receive_text()
#             # Optional: handle client messages
#             try:
#                 client_data = json.loads(data)
#                 if client_data.get("type") == "client_info":
#                     manager.connection_data[websocket]["client_info"] = client_data
#             except:
#                 pass  # Ignore invalid messages
                
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         manager.disconnect(websocket)

# # ==================== ROUTERS ====================
# app.include_router(department.router)
# app.include_router(appointments.router)
# app.include_router(staff.router)
# app.include_router(new_registration.router)
# app.include_router(add_bloodgroup.router)
# app.include_router(blood_donor.router)
# app.include_router(labreport.router)
# app.include_router(bed_group_list.router)
# app.include_router(staffmanagement.router)
# app.include_router(payroll.router)
# app.include_router(attendance.router)
# app.include_router(stock.router)

# # Set up ambulance notifications
# ambulance.set_notify_clients(notify_clients)
# app.include_router(ambulance.router)

# app.include_router(billing.router)
# app.include_router(auth.router)
# app.include_router(security.router)
# app.include_router(user_management.router)
# app.include_router(user_profile.router)
# app.include_router(medicine_allocation.router)
# app.include_router(pharmacybilling.router)
# app.include_router(invoice_generator.router)
# app.include_router(notifications.router)
# app.include_router(invoice_pharmacy_billing.router)
# app.include_router(hospital_billing.router)
# app.include_router(dashboard.router)
# app.include_router(treatment_charges.router)
# app.include_router(laboratory.router)
# app.include_router(surgery.router)
# app.include_router(settings.router)
# app.include_router(charges. router)

# # Make notify_clients available to routers
# app.state.notify_clients = notify_clients

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True,
#         log_level="info"
#     )
    
    

from http.client import HTTPException
from pathlib import Path
import Fastapi_app.django_setup  # <-- sets DJANGO_SETTINGS_MODULE & calls django.setup()
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
import json
from typing import List, Dict, Any
from datetime import datetime
import asyncio
from django.db import close_old_connections
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from fastapi import WebSocket, WebSocketDisconnect, Cookie, Query
from typing import Optional
import jwt
from HMS_backend.models import User, Permission
from asgiref.sync import sync_to_async

load_dotenv()

# Import WebSocket service
from Fastapi_app.services.websocket_service import manager, notify_clients

# ----------------------------------------------------------------
# Import routers **after** Django is ready
# ----------------------------------------------------------------
from Fastapi_app.routers import (
    department, appointments, staff, new_registration, add_bloodgroup,
    blood_donor, labreport, bed_group_list, staffmanagement, payroll,
    attendance, stock, ambulance, billing, auth, security,
    user_management, user_profile, medicine_allocation,
    pharmacybilling, invoice_generator, notifications, invoice_pharmacy_billing, hospital_billing,
    dashboard, treatment_charges, laboratory, surgery, settings, charges
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Hospital Management System API...")
    
    # Start background task for connection health checks
    async def health_check_loop():
        while True:
            await asyncio.sleep(30)  # Check every 30 seconds
            await manager.check_connection_health()
    
    asyncio.create_task(health_check_loop())
    
    yield
    # Shutdown
    print("Shutting down Hospital Management System API...")

# ----------------------------------------------------------------
# FastAPI app
# ----------------------------------------------------------------
app = FastAPI(
    title="Hospital Management System API",
    description="Comprehensive HMS with real-time notifications",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[            # if you later add https
        "http://localhost:5173",              # dev - vite
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
        "Set-Cookie",
        "Cookie",
    ],
    expose_headers=["Set-Cookie", "Authorization"],
    max_age=86400,  # 24 hours
)

# ==================== STATIC FILES ====================
PROFILE_PIC_DIR = os.path.abspath("profile_pictures")
os.makedirs(PROFILE_PIC_DIR, exist_ok=True)
app.mount(
    "/profile_pictures",
    StaticFiles(directory=PROFILE_PIC_DIR),
    name="profile_pictures",
)

PATIENT_PHOTOS_DIR = os.path.abspath("Fastapi_app/Patient_photos")
os.makedirs(PATIENT_PHOTOS_DIR, exist_ok=True)
app.mount(
    "/static/patient_photos", 
    StaticFiles(directory=PATIENT_PHOTOS_DIR), 
    name="patient_photos"
)

STAFF_PICTURES_DIR = os.path.abspath("Fastapi_app/staffs_pictures")
os.makedirs(STAFF_PICTURES_DIR, exist_ok=True)
app.mount(
    "/static/staffs_pictures",
    StaticFiles(directory=STAFF_PICTURES_DIR),
    name="staffs_pictures"
)
INVOICE_DIR = os.path.abspath("Fastapi_app/pharmacy/invoices")
os.makedirs(INVOICE_DIR, exist_ok=True)

app.mount("/invoices", StaticFiles(directory=INVOICE_DIR), name="invoices")

HOSPITALBILLING_DIR = os.path.abspath("Fastapi_app/invoices_generator")
os.makedirs(HOSPITALBILLING_DIR, exist_ok=True)

# Mount the static files directory so invoices can be served/downloaded
app.mount("/invoices_generator", StaticFiles(directory=HOSPITALBILLING_DIR), name="invoices_generator")
app.mount("/Fastapi_app/Staff_documents", StaticFiles(directory="Fastapi_app/Staff_documents"), name="staff_docs")

app.mount("/uploads", StaticFiles(directory="Fastapi_app/uploads"), name="uploads")

BASE_DIR = Path(__file__).resolve().parent.parent
media_dir = BASE_DIR / "media"
media_dir.mkdir(exist_ok=True)
(media_dir / "hospital_logo").mkdir(exist_ok=True)

# Mount static files
app.mount("/media", StaticFiles(directory=str(media_dir)), name="media")

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

@app.middleware("http")
async def django_db_lifecycle(request: Request, call_next):
    close_old_connections()
    response = await call_next(request)
    close_old_connections()
    return response

# ==================== WEBSOCKET HELPER CLASSES ====================
class MockRequest:
    """Create a mock Request object that mimics FastAPI Request for cookie extraction"""
    def __init__(self, websocket: WebSocket):
        self._cookies = {}
        self.headers = websocket.headers
        
        # Parse cookies from the Cookie header
        cookie_header = websocket.headers.get("cookie")
        if cookie_header:
            for cookie in cookie_header.split(";"):
                if "=" in cookie:
                    key, value = cookie.strip().split("=", 1)
                    self._cookies[key] = value
    
    @property
    def cookies(self):
        return self._cookies

# Import your existing get_current_user function
from Fastapi_app.routers.user_profile import get_current_user

# ==================== PERMISSIONS HELPER ====================
async def get_user_permissions_set(user: User) -> set:
    """Extract user permissions as a set with detailed logging - ASYNC VERSION"""
    print(f"\n🔍 Getting permissions for user: {user.username} (ID: {user.id}, Role: {user.role})")
    permissions = set()
    
    # Superusers have all permissions
    if user.is_superuser:
        print(f"👑 User is superuser - granting ALL permissions")
        from HMS_backend.models import Permission
        
        # Use sync_to_async for database query
        @sync_to_async
        def get_all_modules():
            return [module for module, _ in Permission.MODULE_CHOICES]
        
        all_modules = await get_all_modules()
        for module in all_modules:
            permissions.add(module)
        permissions.add("admin_access")
        print(f"📋 Granted {len(permissions)} permissions to superuser")
        return permissions
    
    # Get permissions from database
    try:
        from HMS_backend.models import Permission
        
        print(f"🔎 Querying permissions for role: '{user.role.lower()}'")
        
        # Use sync_to_async for all database operations
        @sync_to_async
        def get_permission_data():
            # Get all permissions for this role
            all_role_perms = list(Permission.objects.filter(role=user.role.lower()))
            
            # Get only enabled permissions
            enabled_perms = list(Permission.objects.filter(role=user.role.lower(), enabled=True))
            
            return {
                'all': all_role_perms,
                'enabled': enabled_perms,
                'all_count': len(all_role_perms),
                'enabled_count': len(enabled_perms)
            }
        
        perm_data = await get_permission_data()
        
        print(f"📊 Total permissions in DB for role '{user.role.lower()}': {perm_data['all_count']}")
        
        # Log all permissions found
        for p in perm_data['all']:
            status = "ENABLED" if p.enabled else "DISABLED"
            print(f"  - {p.module}: {status}")
        
        print(f"✅ Enabled permissions for role '{user.role.lower()}': {perm_data['enabled_count']}")
        
        for perm in perm_data['enabled']:
            permissions.add(perm.module)
            print(f"  ➕ Added permission: {perm.module}")
            
    except Exception as e:
        print(f"❌ Error fetching permissions: {e}")
        import traceback
        traceback.print_exc()
    
    # Add role-based permissions
    if user.role and user.role.lower() == "admin":
        permissions.add("admin_access")
        print(f"👑 Added admin_access permission for admin role")
    
    print(f"📋 Final permission set for {user.username}: {sorted(permissions)}")
    print(f"✅ Has 'departments'? {'YES' if 'departments' in permissions else 'NO'}")
    
    return permissions

# ==================== WEBSOCKET ENDPOINT ====================
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint with cookie-based authentication matching your /profile/me endpoint
    """
    print(f"\n{'='*60}")
    print(f"🌐 NEW WEBSOCKET CONNECTION ATTEMPT")
    print(f"{'='*60}")
    
    # Log all headers for debugging
    print(f"📋 All headers:")
    for key, value in websocket.headers.items():
        print(f"   {key}: {value}")
    
    print(f"\n🍪 Cookie header: {websocket.headers.get('cookie', 'NOT PRESENT')}")
    
    user = None
    user_id = None
    permissions = set()
    
    try:
        # Create a mock request from the WebSocket
        mock_request = MockRequest(websocket)
        
        # Log the cookies we parsed
        print(f"🍪 Parsed cookies: {mock_request.cookies}")
        
        # Check if access_token is in cookies
        if 'access_token' in mock_request.cookies:
            token_preview = mock_request.cookies['access_token'][:20] + "..."
            print(f"🔑 Found access_token in cookies: {token_preview}")
        else:
            print(f"❌ No access_token found in cookies")
            print(f"   Available cookies: {list(mock_request.cookies.keys())}")
        
        # Try to authenticate using the same logic as your /profile/me endpoint
        user = await get_current_user(mock_request)
        print(f"✅✅✅ SUCCESSFULLY AUTHENTICATED: {user.username} (ID: {user.id})")
        
        # Get permissions using the async version
        permissions = await get_user_permissions_set(user)
        
    except HTTPException as e:
        print(f"⚠️ Authentication failed with HTTPException: {e.detail}")
        print(f"   Status code: {e.status_code}")
        user = None
    except Exception as e:
        print(f"❌ Unexpected error during authentication: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        user = None
    
    if user:
        user_id = user.id
        print(f"✅ Authenticated user: {user.username} (ID: {user_id})")
        print(f"📋 User permissions ({len(permissions)}): {sorted(permissions)}")
        
        # Specifically check for departments permission
        if 'departments' in permissions:
            print(f"✅✅✅ USER HAS 'departments' PERMISSION - WILL RECEIVE DEPARTMENT NOTIFICATIONS")
        else:
            print(f"❌❌❌ USER DOES NOT HAVE 'departments' PERMISSION")
    else:
        print("⚠️ UNAUTHENTICATED CONNECTION - will only receive public notifications")
        print("   No user permissions will be loaded")
    
    # Connect with user info
    await manager.connect(websocket, user_id, permissions)
    print(f"📊 Connection stored. Total active connections: {len(manager.active_connections)}")
    
    try:
        # Send connection confirmation with auth status
        await manager.send_personal_message(
            json.dumps({
                "type": "connection_established",
                "message": "Connected to real-time notifications",
                "timestamp": datetime.now().isoformat(),
                "authenticated": user is not None,
                "user_id": user_id
            }),
            websocket
        )
        
        # Keep connection alive and handle messages
        while True:
            data = await websocket.receive_text()
            try:
                client_data = json.loads(data)
                print(f"📨 Received message from client: {client_data.get('type')}")
                
                # Handle heartbeat
                if client_data.get("type") == "heartbeat":
                    await manager.update_heartbeat(websocket)
                    await websocket.send_json({"type": "heartbeat_ack"})
                    print("💓 Heartbeat received and acknowledged")
                
                # Handle pong response
                elif client_data.get("type") == "pong":
                    await manager.update_heartbeat(websocket)
                
                # Handle client info
                elif client_data.get("type") == "client_info":
                    if websocket in manager.connection_data:
                        manager.connection_data[websocket]["client_info"] = client_data
                        print(f"📱 Client info updated")
                
            except json.JSONDecodeError:
                print(f"❌ Received invalid JSON")
            except Exception as e:
                print(f"❌ Error processing message: {e}")
                
    except WebSocketDisconnect:
        print(f"🔌 WebSocket disconnected for user {user_id}")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
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

# Set up ambulance notifications
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
app.include_router(notifications.router)
app.include_router(invoice_pharmacy_billing.router)
app.include_router(hospital_billing.router)
app.include_router(dashboard.router)
app.include_router(treatment_charges.router)
app.include_router(laboratory.router)
app.include_router(surgery.router)
app.include_router(settings.router,prefix="/settings",
    tags=["Settings"])
app.include_router(charges.router)

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