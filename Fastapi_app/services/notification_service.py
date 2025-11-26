# fastapi_app/services/notification_service.py
from datetime import datetime
import json
from main import manager

class NotificationService:
    @staticmethod
    async def send_notification(event_type: str, message: str, notification_type: str = "info", data: dict = None):
        payload = {
            "type": event_type,
            "message": message,
            "notification_type": notification_type,
            "timestamp": datetime.now().isoformat(),
            "data": data or {}
        }
        await manager.broadcast(payload)

    @staticmethod
    async def send_appointment_created(appointment, staff, department):
        await NotificationService.send_notification(
            event_type="appointment_created",
            message=f"New appointment: {appointment.patient_name} with Dr. {staff.full_name}",
            notification_type="info",
            data={
                "appointment_id": appointment.id,
                "patient_name": appointment.patient_name,
                "staff_name": staff.full_name,
                "department": department.name,
                "appointment_type": appointment.appointment_type,
                "room_no": appointment.room_no,
                "redirect_to": "/appointments"
            }
        )