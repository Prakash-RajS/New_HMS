# # fastapi_app/services/websocket_service.py
# from datetime import datetime
# import json
# from typing import Dict, Any

# class WebSocketManager:
#     def __init__(self):
#         self.active_connections = []
#         self.connection_data = {}

#     async def connect(self, websocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)
#         self.connection_data[websocket] = {
#             "connected_at": datetime.now(),
#             "client_info": None
#         }
#         print(f"Client connected. Total connections: {len(self.active_connections)}")

#     def disconnect(self, websocket):
#         if websocket in self.active_connections:
#             self.active_connections.remove(websocket)
#         if websocket in self.connection_data:
#             del self.connection_data[websocket]
#         print(f"Client disconnected. Total connections: {len(self.active_connections)}")

#     async def send_personal_message(self, message: str, websocket):
#         try:
#             await websocket.send_text(message)
#         except Exception as e:
#             print(f"Error sending message to client: {e}")
#             self.disconnect(websocket)

#     async def broadcast(self, message: Dict[str, Any]):
#         if not self.active_connections:
#             return
            
#         message_str = json.dumps(message, default=str, ensure_ascii=False)
#         disconnected = []
        
#         for connection in self.active_connections:
#             try:
#                 await connection.send_text(message_str)
#             except Exception as e:
#                 print(f"Error broadcasting to client: {e}")
#                 disconnected.append(connection)
                
#         for connection in disconnected:
#             self.disconnect(connection)

# # Global instance
# manager = WebSocketManager()

# async def notify_clients(event_type: str, **data):
#     """Helper function to broadcast notifications to all connected clients"""
#     payload = {
#         "type": event_type,
#         "timestamp": datetime.now().isoformat(),
#         **data
#     }
#     await manager.broadcast(payload)

#Fastapi_app/services/websocket_service.py
from datetime import datetime
import json
from typing import Dict, Any, Set, Optional
from fastapi import WebSocket
import asyncio

class WebSocketManager:
    def __init__(self):
        self.active_connections = []
        self.connection_data = {}  # Store user info per connection
        self.user_connections = {}  # Map user_id -> list of connections

    async def connect(self, websocket: WebSocket, user_id: int = None, permissions: Set[str] = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        
        # Store connection data with user info and permissions
        self.connection_data[websocket] = {
            "connected_at": datetime.now(),
            "user_id": user_id,
            "permissions": permissions or set(),
            "client_info": None,
            "last_heartbeat": datetime.now()
        }
        
        # Track user's connections if user is authenticated
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)
        
        print(f"User {user_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        # Get user_id before removing
        user_id = None
        if websocket in self.connection_data:
            user_id = self.connection_data[websocket].get("user_id")
        
        # Remove from active connections
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from connection data
        if websocket in self.connection_data:
            del self.connection_data[websocket]
        
        # Remove from user connections
        if user_id and user_id in self.user_connections:
            if websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        print(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
            return True
        except Exception as e:
            print(f"Error sending message to client: {e}")
            self.disconnect(websocket)
            return False

    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast to all connected clients"""
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
    
    async def check_connection_health(self):
        """Check if connections are still alive and clean up dead ones"""
        if not self.active_connections:
            return
        
        disconnected = []
        for connection in self.active_connections:
            try:
                # Try to send a ping
                await connection.send_json({"type": "ping"})
            except:
                disconnected.append(connection)
        
        for connection in disconnected:
            self.disconnect(connection)
        
        if disconnected:
            print(f"🧹 Cleaned up {len(disconnected)} dead connections")
    
    async def broadcast_to_users_with_permission(self, message: Dict[str, Any], required_permission: Optional[str] = None):
        """Send notification only to users with specific permission with detailed logging"""
        if not self.active_connections:
            print("📢 No active connections to broadcast to")
            return
        
        print(f"\n📢 BROADCASTING NOTIFICATION")
        print(f"   Event type: {message.get('type')}")
        print(f"   Required permission: '{required_permission}'")
        print(f"   Total active connections: {len(self.active_connections)}")
        
        # If no permission required, broadcast to all
        if not required_permission:
            print("📢 No permission required - broadcasting to ALL")
            await self.broadcast(message)
            return
            
        message_str = json.dumps(message, default=str, ensure_ascii=False)
        disconnected = []
        sent_count = 0
        auth_count = 0
        
        # First, check which connections are still alive
        alive_connections = []
        for connection in self.active_connections:
            try:
                # Try a simple operation to check if connection is alive
                await connection.send_json({"type": "ping"})
                alive_connections.append(connection)
            except:
                disconnected.append(connection)
        
        # Clean up dead connections
        for connection in disconnected:
            self.disconnect(connection)
        
        if disconnected:
            print(f"🧹 Removed {len(disconnected)} dead connections before broadcasting")
        
        # Now broadcast to alive connections
        for connection in alive_connections:
            connection_data = self.connection_data.get(connection, {})
            user_id = connection_data.get("user_id")
            connection_permissions = connection_data.get("permissions", set())
            
            if user_id:
                auth_count += 1
                print(f"   Checking authenticated connection - User ID: {user_id}")
            
            if required_permission in connection_permissions:
                try:
                    await connection.send_text(message_str)
                    sent_count += 1
                    print(f"   ✅ SENT to user {user_id} (has '{required_permission}' permission)")
                except Exception as e:
                    print(f"   ❌ Error sending to user {user_id}: {e}")
                    disconnected.append(connection)
            else:
                if user_id:
                    print(f"   ❌ SKIPPED user {user_id} (does NOT have '{required_permission}' permission)")
        
        print(f"\n📊 Broadcast summary:")
        print(f"   Original connections: {len(self.active_connections)}")
        print(f"   Alive connections: {len(alive_connections)}")
        print(f"   Authenticated users: {auth_count}")
        print(f"   Sent to: {sent_count}")
        print(f"   Newly disconnected: {len(disconnected)}")
        print(f"{'='*50}\n")
        
        # Clean up any new disconnected connections
        for connection in disconnected:
            self.disconnect(connection)

    async def update_heartbeat(self, websocket: WebSocket):
        """Update last heartbeat time for connection"""
        if websocket in self.connection_data:
            self.connection_data[websocket]["last_heartbeat"] = datetime.now()

# Global instance
manager = WebSocketManager()


# Map notification types to required permissions
NOTIFICATION_PERMISSION_MAP = {
    # Appointment notifications
    "appointment_created": "appointments",
    "appointment_updated": "appointments",
    "appointment_deleted": "appointments",
    "appointment_status_changed": "appointments",
    
    # Patient notifications
    "patient_registered": "patients_view",
    "patient_updated": "patients_view",
    "patient_deleted": "patients_view",
    "patient_admitted": "patients_view",
    "patient_discharged": "patients_view",
    
    # Lab report notifications
    "lab_report_created": "lab_reports",
    "lab_report_updated": "lab_reports",
    "lab_report_deleted": "lab_reports",
    "lab_report_completed": "lab_reports",
    
    # Staff notifications
    "staff_registered": "staff_management",
    "staff_updated": "staff_management",
    "staff_deleted": "staff_management",
    
    # Ambulance notifications
    "ambulance_unit_created": "ambulance",
    "ambulance_unit_updated": "ambulance",
    "ambulance_unit_deleted": "ambulance",
    "ambulance_dispatch_updated": "ambulance",
    "ambulance_dispatch_deleted": "ambulance",
    "ambulance_trip_deleted": "ambulance",
    
    # Medicine/Pharmacy notifications
    "medicine_allocated": "medicine_allocation",
    "medicine_updated": "medicine_allocation",
    "medicine_deleted": "medicine_allocation",
    "stock_added": "pharmacy_inventory",
    "stock_updated": "pharmacy_inventory",
    "stock_deleted": "pharmacy_inventory",
    "stock_low": "pharmacy_inventory",
    "stock_out": "pharmacy_inventory",
    "stock_low_alert": "pharmacy_inventory",
    "stock_out_alert": "pharmacy_inventory",
    
    # ========== BILLING NOTIFICATIONS - ALL RESTRICTED ==========
    # General billing
    "invoice_generated": "billing",
    "invoice_created": "billing",
    "invoice_updated": "billing",
    "invoice_deleted": "billing",
    "payment_received": "billing",
    "payment_failed": "billing",
    "invoice_status_changed": "billing",
    "invoice_not_found": "billing",
    "billing_error": "billing",              # ← Fixed: Was None
    "billing_statistics_updated": "billing",
    
    # PDF/Download events - RESTRICTED TO BILLING
    "pdf_downloaded": "billing",              # ← Fixed: Was None
    "pdf_bulk_downloaded": "billing",         # ← Fixed: Was None
    "export_completed": "billing",            # ← Fixed: Was None
    
    # Pharmacy billing
    "pharmacy_bill_generated": "pharmacy_billing",
    "pharmacy_payment_received": "pharmacy_billing",
    "pharmacy_bulk_export": "pharmacy_billing",  # ← Fixed: Was None
    "hospital_bill_generated": "billing",
    "hospital_payment_received": "billing",
    
    # Department notifications
    "department_created": "departments",
    "department_updated": "departments",
    "department_deleted": "departments",
    "department_status_changed": "departments",
    
    # Room/Bed notifications
    "bed_group_created": "room_management",
    "bed_group_updated": "room_management",
    "bed_group_deleted": "room_management",
    "bed_created": "room_management",
    "bed_updated": "room_management",
    "bed_deleted": "room_management",
    "bed_allocated": "room_management",
    "bed_vacated": "room_management",
    "room_occupancy_changed": "room_management",
    "bed_capacity_changed": "room_management",
    "bed_group_capacity_changed": "room_management",
    "bed_group_full": "room_management",
    "bed_group_available": "room_management",
    
    # Blood Bank notifications
    "blood_group_created": "blood_bank",
    "blood_group_updated": "blood_bank",
    "blood_group_deleted": "blood_bank",
    "blood_stock_updated": "blood_bank",
    "blood_stock_low": "blood_bank",
    "blood_stock_out": "blood_bank",
    "blood_donation_received": "blood_bank",
    "blood_issued": "blood_bank",
    "donor_registered": "blood_bank",
    "donor_updated": "blood_bank",
    "donor_deleted": "blood_bank",
    "donor_eligibility_changed": "blood_bank",
    "donation_received": "blood_bank",
    "donor_became_eligible": "blood_bank",
    "urgent_blood_request": "blood_bank",
    
    # System notifications (admin only)
    "user_login": "admin_access",
    "user_logout": "admin_access",
    "unauthorized_access": "admin_access",
    "system_alert": "admin_access",
    "emergency_alert": "admin_access",
    
    # ========== PUBLIC NOTIFICATIONS (No permission required) ==========
    # Only these should be public
    "test_notification": None,
    "statistics_updated": None,      # If you want dashboard stats to be public
}

async def notify_clients(event_type: str, message: str = None, notification_type: str = "info", data: dict = None):
    """Send notification with permission-based filtering"""
    
    # Get required permission for this event type
    required_permission = NOTIFICATION_PERMISSION_MAP.get(event_type)
    
    # Prepare notification payload
    payload = {
        "type": event_type,
        "message": message,
        "notification_type": notification_type,
        "data": data or {},
        "timestamp": datetime.now().isoformat()
    }
    
    print(f"📢 Sending notification: {event_type} (Required permission: {required_permission})")
    
    # Send to users with the required permission
    await manager.broadcast_to_users_with_permission(payload, required_permission)