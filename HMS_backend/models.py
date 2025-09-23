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
    class Meta:
        db_table = "staff"  


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


class BedGroup(models.Model):
    bedGroup = models.CharField(max_length=100, unique=True)
    capacity = models.IntegerField()
    occupied = models.IntegerField(default=0)
    unoccupied = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default="Available")

    def update_status(self):
        """Update availability status"""
        self.status = "Available" if self.unoccupied > 0 else "Not Available"
        self.save()

    def __str__(self):
        return f"{self.bedGroup} (Total: {self.capacity}, Occ: {self.occupied}, Free: {self.unoccupied})"


class Bed(models.Model):
    bed_number = models.IntegerField()
    is_occupied = models.BooleanField(default=False)
    bed_group = models.ForeignKey(BedGroup, related_name="beds", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("bed_number", "bed_group")

    def __str__(self):
        return f"Bed {self.bed_number} ({'Occupied' if self.is_occupied else 'Free'}) in {self.bed_group.bedGroup}"
    

class Payroll(models.Model):
    STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Unpaid", "Unpaid"),
        ("Pending", "Pending"),
        ("Failed", "Failed")
    ]

    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name="payrolls")
    pay_period = models.CharField(max_length=20)   # e.g., "Mar 2025"
    net_pay = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.staff.full_name} - {self.pay_period}"
    
class Staff_Management(models.Model):
    staff = models.ForeignKey(
        Staff,
        on_delete=models.CASCADE,
        related_name="attendance_records",null=True, blank=True
    )
    date = models.DateField(null=True, blank=True)
    shift = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True)
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)

    class Meta:
        db_table = "staff_management"

    def __str__(self):
        return self.staff.full_name if self.staff else "Unnamed Staff"
    
class Stock(models.Model):
    product_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    batch_number = models.CharField(max_length=100)
    vendor = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=0)
    vendor_id = models.CharField(max_length=50)
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('outofstock', 'Out of Stock')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stock"
        unique_together = ('product_name', 'batch_number', 'vendor_id')

    def __str__(self):
        return f"{self.product_name} - {self.batch_number} - {self.quantity}"

    def add_stock(self, amount: int):
        """Add stock quantity and update status automatically."""
        self.quantity += amount
        self.status = "available" if self.quantity > 0 else "outofstock"
        self.save()

    @property
    def no_of_stocks(self):
        """Alias for total quantity of stock."""
        return self.quantity
    
class AmbulanceUnit(models.Model):
    unit_number = models.CharField(max_length=50, unique=True)  # e.g. "AMB-09"
    vehicle_make = models.CharField(max_length=100, blank=True, null=True)
    vehicle_model = models.CharField(max_length=100, blank=True, null=True)
    in_service = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "ambulance_units"
        ordering = ["unit_number"]

    def __str__(self):
        return self.unit_number


class Dispatch(models.Model):
    CALL_TYPE_CHOICES = [
        ("Emergency", "Emergency"),
        ("Non-Emergency", "Non-Emergency"),
        ("Transfer", "Transfer"),
    ]
    STATUS_CHOICES = [
        ("Completed", "Completed"),
        ("En Route", "En Route"),
        ("Standby", "Standby"),
        ("Cancelled", "Cancelled")
    ]

    dispatch_id = models.CharField(max_length=50, unique=True)  # e.g. "D-10241"
    timestamp = models.DateTimeField()  # dispatched time
    unit = models.ForeignKey(AmbulanceUnit, on_delete=models.SET_NULL, null=True, related_name="dispatches")
    dispatcher = models.CharField(max_length=150)  # name of dispatcher
    call_type = models.CharField(max_length=30, choices=CALL_TYPE_CHOICES, default="Emergency")
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Standby")

    class Meta:
        db_table = "ambulance_dispatches"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.dispatch_id} - {self.unit}"


class Trip(models.Model):
    TRIP_STATUS = [
        ("Completed", "Completed"),
        ("En Route", "En Route"),
        ("Standby", "Standby"),
        ("Cancelled", "Cancelled"),
    ]

    trip_id = models.CharField(max_length=50, unique=True)  # e.g. "T-7751"
    dispatch = models.ForeignKey(Dispatch, on_delete=models.CASCADE, related_name="trips")
    unit = models.ForeignKey(AmbulanceUnit, on_delete=models.SET_NULL, null=True, related_name="trips")
    crew = models.TextField(blank=True, null=True)  # e.g. "Paramedic Lewis, EMT Clark"
    patient_id = models.CharField(max_length=50, blank=True, null=True)
    pickup_location = models.CharField(max_length=255, blank=True, null=True)
    destination = models.CharField(max_length=255, blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    mileage = models.CharField(max_length=50, blank=True, null=True)  # could be minutes or distance
    status = models.CharField(max_length=30, choices=TRIP_STATUS, default="Standby")
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ambulance_trips"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.trip_id} (Dispatch: {self.dispatch.dispatch_id})"

class Invoice(models.Model):
    STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Unpaid", "Unpaid"),
        ("Pending", "Pending"),
    ]

    invoice_id = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    patient_name = models.CharField(max_length=100)
    patient_id = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.invoice_id} - {self.patient_name} ({self.status})"
