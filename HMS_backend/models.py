from django.db import models
from django.utils import timezone
from datetime import timedelta

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
    staff = models.ForeignKey("Staff", on_delete=models.CASCADE, related_name="appointments")
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

from django.db import models

class Staff(models.Model):
    # 🔹 New employee ID (used in your FastAPI code)
    employee_id = models.CharField(max_length=50, unique=True, null=True, blank=True)


    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20)
    age = models.IntegerField()
    marital_status = models.CharField(max_length=50)
    address = models.TextField()
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    national_id = models.CharField(max_length=100, unique=True)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    date_of_joining = models.DateField()
    designation = models.CharField(max_length=100)

    # 🔹 ForeignKey to Department
    department = models.ForeignKey(
        "Department", 
        on_delete=models.CASCADE,
        related_name="staff_members"
    )

    specialization = models.CharField(max_length=150, blank=True, null=True)
    status = models.CharField(max_length=50)
    shift_timing = models.CharField(max_length=100)

    # 🔹 File fields
    certificates = models.TextField(blank=True, null=True)
    profile_picture = models.TextField(blank=True, null=True)  # path saved here

    def __str__(self):
        return f"{self.full_name} - {self.designation} ({self.department.name})"


class Patient(models.Model):
    patient_unique_id = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=200)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    marital_status = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email_address = models.EmailField(blank=True, null=True)
    national_id = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    date_of_registration = models.DateField(blank=True, null=True)
    occupation = models.CharField(max_length=100, blank=True, null=True)
    weight_in_kg = models.FloatField(blank=True, null=True)
    height_in_cm = models.FloatField(blank=True, null=True)

    blood_group = models.CharField(max_length=5, blank=True, null=True)
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)
    body_temperature = models.FloatField(blank=True, null=True)
    consultation_type = models.CharField(max_length=20, blank=True, null=True)

    department = models.ForeignKey("Department", on_delete=models.SET_NULL, null=True)
    staff = models.ForeignKey("Staff", on_delete=models.SET_NULL, null=True)

    appointment_type = models.CharField(max_length=20, blank=True, null=True)
    admission_date = models.DateField(blank=True, null=True)
    room_number = models.CharField(max_length=20, blank=True, null=True)
    test_report_details = models.TextField(blank=True, null=True)
    casualty_status = models.CharField(max_length=10, blank=True, null=True)
    reason_for_visit = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to="patient_photos/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "patients"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.patient_unique_id:
            last = Patient.objects.order_by("id").last()
            if last and last.patient_unique_id.startswith("PAT"):
                num = int(last.patient_unique_id.replace("PAT", ""))
                self.patient_unique_id = f"PAT{num + 1}"
            else:
                self.patient_unique_id = "PAT1000"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} ({self.patient_unique_id})"
    
class BloodGroup(models.Model):
    BLOOD_TYPES = [
        ("A+", "A+"),
        ("A-", "A-"),
        ("B+", "B+"),
        ("B-", "B-"),
        ("O+", "O+"),
        ("O-", "O-"),
        ("AB+", "AB+"),
        ("AB-", "AB-"),
    ]

    STATUS_CHOICES = [
        ("Available", "Available"),
        ("Low Stock", "Low Stock"),
        ("Out of Stock", "Out of Stock"),
    ]

    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPES, unique=True)
    available_units = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Available")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blood_groups"
        ordering = ["blood_type"]

    def __str__(self):
        return f"{self.blood_type} ({self.available_units} units - {self.status})"

    def update_status(self):
        """Update stock status based on available units"""
        if self.available_units == 0:
            self.status = "Out of Stock"
        elif self.available_units < 50:
            self.status = "Low Stock"
        else:
            self.status = "Available"
        self.save()


class Donor(models.Model):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    donor_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    blood_type = models.CharField(max_length=3, choices=BloodGroup.BLOOD_TYPES)
    phone = models.CharField(max_length=20, unique=True)
    last_donation_date = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[("Eligible", "Eligible"), ("Not Eligible", "Not Eligible")],
        default="Not Eligible",
    )
    added_date = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "donors"
        ordering = ["donor_name"]

    def __str__(self):
        return f"{self.donor_name} - {self.blood_type} ({self.status})"

    def check_eligibility(self):
        """Donor becomes eligible 6 months after last donation"""
        if self.last_donation_date:
            next_eligible_date = self.last_donation_date + timedelta(days=180)
            if timezone.now().date() >= next_eligible_date:
                self.status = "Eligible"
            else:
                self.status = "Not Eligible"
        else:
            # Newly added donor → Not Eligible until 6 months pass
            next_eligible_date = self.added_date + timedelta(days=180)
            if timezone.now().date() >= next_eligible_date:
                self.status = "Eligible"
            else:
                self.status = "Not Eligible"
        self.save()



from HMS_backend.models import Patient

class LabReport(models.Model):
    order_id = models.CharField(max_length=20, unique=True)  # LABID0001 format
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="lab_reports", null=True)
    department = models.CharField(max_length=100)
    test_type = models.CharField(max_length=100)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('inprogress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "lab_reports"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_id} - {self.patient.full_name}"

    def save(self, *args, **kwargs):
        if not self.order_id:
            last = LabReport.objects.all().order_by("id").last()
            if not last:
                self.order_id = "LABID0001"
            else:
                last_id_num = int(last.order_id.replace("LABID", ""))
                self.order_id = f"LABID{last_id_num + 1:04d}"
        super().save(*args, **kwargs)

    @property
    def patient_name(self):
        return str(self.patient.full_name)

    @property
    def patient_id(self):
        return str(self.patient.patient_unique_id)


