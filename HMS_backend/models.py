from django.db import models

class Department(models.Model):
    STATUS_CHOICES = (("active", "Active"), ("inactive", "Inactive"))

    name = models.CharField(max_length=200, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "departments"
        ordering = ["name"]

    def __str__(self):
        return self.name
    

from HMS_backend.models import Department  # already defined
# from HMS_backend.models import Doctor   # assuming you already have Doctor model

class Appointment(models.Model):
    APPOINTMENT_TYPES = (
        ("checkup", "Check Up"),
        ("followup", "Follow Up"),
        ("emergency", "Emergency"),
    )

    STATUS_CHOICES = (
        ("new", "New"),
        ("normal", "Normal"),
        ("severe", "Severe"),
    )

    patient_name = models.CharField(max_length=200)
    patient_id = models.CharField(max_length=20, unique=True, editable=False)  # auto-generated
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="appointments")
    # doctor = models.ForeignKey("Doctor", on_delete=models.CASCADE, related_name="appointments")
    doctor = models.CharField(max_length=20, unique=True, editable=False)
    room_no = models.CharField(max_length=20)
    phone_no = models.CharField(max_length=15)
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "appointments"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.patient_id:
            last = Appointment.objects.all().order_by("id").last()
            if last:
                last_num = int(last.patient_id.replace("SAH", ""))
                self.patient_id = f"SAH{last_num + 1}"
            else:
                self.patient_id = "SAH2500"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient_name} ({self.patient_id})"
