from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin



class UserManager(BaseUserManager):
    def create_user(self, username, password=None, staff=None, role="staff", **extra_fields):
        if not username:
            raise ValueError("The username must be set")
        if not password:
            raise ValueError("Password must be set")

        user = self.model(
            username=username,
            staff=staff,
            role=role,  # ✅ store role correctly
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not password:
            raise ValueError("Superuser must have a password")

        # ✅ always set role = admin for superuser
        return self.create_user(
            username=username,
            password=password,
            role="admin",      # <-- FIXED HERE
            staff=None,        # superuser not linked to Staff model
            **extra_fields
        )


# ------------------ Custom User ------------------
class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    role = models.CharField(max_length=50, default="staff")  # default for normal users
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    staff = models.OneToOneField("Staff", on_delete=models.CASCADE, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username


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
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("emergency", "Emergency"),
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
        
        # Call the original save method
        super().save(*args, **kwargs)
        
        # Update staff statistics
        if self.staff:
            self.staff.update_statistics(save=True)
            print(f"✅ Updated patient count for staff {self.staff.full_name} after appointment creation")

from django.db import models
from django.utils import timezone

class Staff(models.Model):
    # 🔹 Basic Information
    employee_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    marital_status = models.CharField(max_length=50, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    national_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    date_of_joining = models.DateField(null=True, blank=True)
    designation = models.CharField(max_length=100)

    # 🔹 Department Information
    department = models.ForeignKey(
        "Department", 
        on_delete=models.CASCADE,
        related_name="staff_members"
    )

    # 🔹 Professional Information
    specialization = models.CharField(max_length=150, blank=True, null=True)
    status = models.CharField(max_length=50, default="Active")
    shift_timing = models.CharField(max_length=100, null=True, blank=True)
    
    # 🔹 New Dynamic Fields for Doctor Profile
    education = models.TextField(blank=True, null=True)
    about_physician = models.TextField(blank=True, null=True)
    experience = models.CharField(max_length=100, blank=True, null=True)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    board_certifications = models.TextField(blank=True, null=True)
    professional_memberships = models.TextField(blank=True, null=True)
    languages_spoken = models.TextField(blank=True, null=True)
    awards_recognitions = models.TextField(blank=True, null=True)
    
    # 🔹 Dynamic Field - Will be calculated
    total_patients_treated = models.IntegerField(default=0)
    
    # 🔹 File fields
    certificates = models.TextField(blank=True, null=True)
    profile_picture = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "staff"

    def __str__(self):
        return f"{self.full_name} - {self.designation} ({self.department.name})"

    def calculate_patient_statistics(self):
        """Calculate total UNIQUE patients treated by this staff member"""
        unique_patient_ids = set()
        
        try:
            # Method 1: Count from Patient model (direct assignment)
            try:
                patient_assignments = Patient.objects.filter(staff=self)
                for patient in patient_assignments:
                    unique_patient_ids.add(patient.id)
                print(f"Direct patient assignments found: {len(patient_assignments)}")
            except Exception as e:
                print(f"Error counting direct patient assignments: {e}")
            
            # Method 2: Count from Appointments
            try:
                appointments = self.appointments.all()
                for appointment in appointments:
                    # Since Appointment doesn't have direct patient FK, we'll use patient_name as identifier
                    # In a real system, you'd want to link Appointment to Patient model
                    patient_identifier = f"appointment_{appointment.patient_name}_{appointment.phone_no}"
                    unique_patient_ids.add(patient_identifier)
                print(f"Appointments found: {appointments.count()}")
            except Exception as e:
                print(f"Error counting appointments: {e}")
            
            # Method 3: Count from Medicine Allocations
            try:
                medicine_allocations = self.medicine_allocations.all()
                for allocation in medicine_allocations:
                    if allocation.patient:
                        unique_patient_ids.add(allocation.patient.id)
                print(f"Medicine allocations found: {medicine_allocations.count()}")
            except Exception as e:
                print(f"Error counting medicine allocations: {e}")
            
            # Method 4: Count from Lab Reports (if they have staff association)
            try:
                lab_reports = LabReport.objects.filter(patient__staff=self)
                for report in lab_reports:
                    if report.patient:
                        unique_patient_ids.add(report.patient.id)
                print(f"Lab reports found: {lab_reports.count()}")
            except Exception as e:
                print(f"Error counting lab reports: {e}")
            
        except Exception as e:
            print(f"Error calculating patient statistics: {e}")
        
        total_count = len(unique_patient_ids)
        print(f"Total UNIQUE patients calculated for {self.full_name}: {total_count}")
        return total_count

    def update_statistics(self, save=True):
        """Update statistics fields immediately"""
        try:
            new_count = self.calculate_patient_statistics()
            if self.total_patients_treated != new_count:
                self.total_patients_treated = new_count
                if save:
                    # Use update to avoid recursion
                    Staff.objects.filter(id=self.id).update(total_patients_treated=new_count)
                    print(f"✅ Updated patient count for {self.full_name}: {new_count}")
        except Exception as e:
            print(f"❌ Error updating statistics: {e}")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        # Auto-generate employee_id if not set
        if not self.employee_id and self.designation:
            from django.db.models import Max
            prefix_map = {
                "doctor": "DOC",
                "nurse": "NUR", 
                "staff": "STA"
            }
            prefix = prefix_map.get(self.designation.lower(), "STA")
            
            last_staff = Staff.objects.filter(
                employee_id__startswith=prefix
            ).aggregate(max_id=Max('employee_id'))
            
            if last_staff['max_id']:
                try:
                    last_num = int(last_staff['max_id'].replace(prefix, ""))
                    new_num = last_num + 1
                except ValueError:
                    new_num = 1
            else:
                new_num = 1
            
            self.employee_id = f"{prefix}{str(new_num).zfill(4)}"
        
        # Call the original save method
        super().save(*args, **kwargs)
        
        # Update statistics immediately after saving (for both new and existing staff)
        self.update_statistics(save=True)

    @classmethod
    def update_all_statistics(cls):
        """Update statistics for all staff members"""
        for staff in cls.objects.all():
            staff.update_statistics(save=True)
            print(f"Updated {staff.full_name}: {staff.total_patients_treated} patients")

    def get_patient_details(self):
        """Get detailed information about patients treated by this staff"""
        patient_details = {
            'direct_assignments': [],
            'appointments': [],
            'medicine_allocations': [],
            'lab_reports': []
        }
        
        try:
            # Direct patient assignments
            patient_details['direct_assignments'] = list(
                Patient.objects.filter(staff=self).values('id', 'full_name', 'patient_unique_id')
            )
            
            # Appointments
            patient_details['appointments'] = list(
                self.appointments.all().values('id', 'patient_name', 'phone_no')
            )
            
            # Medicine allocations
            patient_details['medicine_allocations'] = list(
                self.medicine_allocations.all().values('id', 'patient__full_name', 'medicine_name')
            )
            
        except Exception as e:
            print(f"Error getting patient details: {e}")
            
        return patient_details        


# HMS_backend/models.py
from django.db import models
from django.core.exceptions import ValidationError
from datetime import date


class Patient(models.Model):
    patient_unique_id = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=200)
    
    # === ADMISSION FIELDS ===
    admission_date = models.DateField(null=True, blank=True)  # Set when admitted
    discharge_date = models.DateField(null=True, blank=True)  # Set when discharged
    room_number = models.CharField(max_length=20, blank=True, null=True)  # e.g., "101"

    # === BASIC INFO ===
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

    # === VITALS ===
    weight_in_kg = models.FloatField(blank=True, null=True)
    height_in_cm = models.FloatField(blank=True, null=True)
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    blood_pressure = models.CharField(max_length=20, blank=True, null=True)
    body_temperature = models.FloatField(blank=True, null=True)

    # === CONSULTATION ===
    consultation_type = models.CharField(max_length=20, blank=True, null=True)
    department = models.ForeignKey("Department", on_delete=models.SET_NULL, null=True, blank=True)
    staff = models.ForeignKey("Staff", on_delete=models.SET_NULL, null=True, blank=True)
    appointment_type = models.CharField(max_length=20, blank=True, null=True)
    test_report_details = models.TextField(blank=True, null=True)
    casualty_status = models.CharField(max_length=10, blank=True, null=True)
    reason_for_visit = models.TextField(blank=True, null=True)

    # === MEDIA ===
    photo = models.ImageField(upload_to="patient_photos/", blank=True, null=True)

    # === TIMESTAMPS ===
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "patients"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        # Auto-generate patient_unique_id
        if not self.patient_unique_id:
            last = Patient.objects.order_by("id").last()
            if last and last.patient_unique_id.startswith("PAT"):
                num = int(last.patient_unique_id.replace("PAT", ""))
                self.patient_unique_id = f"PAT{num + 1}"
            else:
                self.patient_unique_id = "PAT1000"
        
        # Call the original save method
        super().save(*args, **kwargs)
        
        # Update staff statistics if staff is assigned
        if self.staff:
            self.staff.update_statistics(save=True)
            print(f"✅ Updated patient count for staff {self.staff.full_name} after patient assignment")
    
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
    email = models.EmailField(max_length=255, unique=True, blank=True, null=True)
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
        """Donor becomes eligible 6 months after last donation or addition"""
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
    capacity = models.IntegerField(default=0)
    occupied = models.IntegerField(default=0)
    unoccupied = models.IntegerField(default=0)
    status = models.CharField(max_length=20, default="Available")

    def refresh_counts(self):
        """
        Recalculate total, occupied, unoccupied beds,
        and update status automatically.
        """
        total_beds = self.beds.count()
        occupied_beds = self.beds.filter(is_occupied=True).count()

        self.capacity = total_beds
        self.occupied = occupied_beds
        self.unoccupied = total_beds - occupied_beds
        self.status = "Available" if self.unoccupied > 0 else "Not Available"
        self.save(update_fields=["capacity", "occupied", "unoccupied", "status"])

    def __str__(self):
        return f"{self.bedGroup} (Total: {self.capacity}, Occ: {self.occupied}, Free: {self.unoccupied})"



class Bed(models.Model):
    bed_number = models.PositiveIntegerField()  # Removed global uniqueness
    is_occupied = models.BooleanField(default=False)
    bed_group = models.ForeignKey(
        BedGroup, related_name="beds", on_delete=models.CASCADE
    )
    patient = models.ForeignKey(
        "Patient", on_delete=models.SET_NULL, null=True, blank=True, related_name="beds"
    )

    class Meta:
        unique_together = ("bed_number", "bed_group")  # Bed number unique per group
        ordering = ["bed_group", "bed_number"]

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

    # ✅ New Fields
    item_code = models.CharField(max_length=50, unique=True)
    rack_no = models.CharField(max_length=50, blank=True, null=True)
    shelf_no = models.CharField(max_length=50, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # ✅ Newly Added Column
    dosage = models.CharField(max_length=100, blank=True, null=True)

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
        return f"{self.product_name} ({self.item_code}) - {self.batch_number} - {self.quantity}"

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

    dispatch_id = models.CharField(max_length=50, unique=True, blank=True)
    timestamp = models.DateTimeField()
    unit = models.ForeignKey(AmbulanceUnit, on_delete=models.SET_NULL, null=True, related_name="dispatches")
    dispatcher = models.CharField(max_length=150)
    call_type = models.CharField(max_length=30, choices=CALL_TYPE_CHOICES, default="Emergency")
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="Standby")

    class Meta:
        db_table = "ambulance_dispatches"
        ordering = ["-timestamp"]

    def save(self, *args, **kwargs):
        if not self.dispatch_id:
            last = Dispatch.objects.order_by("-id").first()
            next_id = 1 if not last else last.id + 1
            self.dispatch_id = f"DSP{next_id:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.dispatch_id} - {self.unit}"



class Trip(models.Model):
    TRIP_STATUS = [
        ("Completed", "Completed"),
        ("En Route", "En Route"),
        ("Standby", "Standby"),
        ("Cancelled", "Cancelled"),
    ]

    trip_id = models.CharField(max_length=50, unique=True, blank=True)
    dispatch = models.ForeignKey(Dispatch, on_delete=models.CASCADE, related_name="trips")
    unit = models.ForeignKey(AmbulanceUnit, on_delete=models.SET_NULL, null=True, related_name="trips")
    crew = models.TextField(blank=True, null=True)
    
    # CHANGED: Now a proper ForeignKey to Patient
    patient = models.ForeignKey(
        Patient,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ambulance_trips"
    )

    pickup_location = models.CharField(max_length=255, blank=True, null=True)
    destination = models.CharField(max_length=255, blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    mileage = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=30, choices=TRIP_STATUS, default="Standby")
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "ambulance_trips"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.trip_id:
            last = Trip.objects.order_by("-id").first()
            next_id = 1 if not last else last.id + 1
            self.trip_id = f"TRP{next_id:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        patient_name = self.patient.full_name if self.patient else "No Patient"
        return f"{self.trip_id} - {patient_name}"


class SecuritySettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="security_settings")

    save_logs = models.BooleanField(default=True)
    two_factor_auth = models.BooleanField(default=False)
    login_alerts = models.BooleanField(default=False)

    last_password_change = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Security Settings - {self.user.username}"
    
class Permission(models.Model):
    role = models.CharField(max_length=100)  # stores Staff.designation
    module = models.CharField(max_length=100)
    enabled = models.BooleanField(default=False)

    MODULE_CHOICES = [
        # Dashboard
        ("dashboard", "View Dashboard"),
        
        # Appointments
        ("appointments", "Manage Appointments"),
        
        # Patients
        ("patients_view", "View Patients"),
        ("patients_create", "Create Patients"),
        ("patients_edit", "Edit Patients"),
        ("patients_profile", "Patient Profile"),
        
        # Administration
        ("departments", "Manage Departments"),
        ("room_management", "Room Management"),
        ("bed_management", "Bed Management"),
        ("staff_management", "Staff Management"),
        
        # Pharmacy
        ("pharmacy_inventory", "Pharmacy Inventory"),
        ("pharmacy_billing", "Pharmacy Billing"),
        
        # Doctors & Nurses
        ("doctors_manage", "Manage Doctors/Nurses"),
        ("medicine_allocation", "Medicine Allocation"),
        
        # Clinical Resources
        ("lab_reports", "Laboratory Reports"),
        ("blood_bank", "Blood Bank"),
        ("ambulance", "Ambulance Management"),
        
        # Billing
        ("billing", "Billing Management"),
        
        # Accounts
        ("user_settings", "User Settings"),
        ("security_settings", "Security Settings"),
        
        # User Management
        ("create_user", "Create User"),
    ]

    class Meta:
        unique_together = ("role", "module")
        db_table = "permissions"

    def __str__(self):
        return f"{self.role} - {self.module} ({'Enabled' if self.enabled else 'Disabled'})"

    @classmethod
    def initialize_default_permissions(cls):
        """Initialize default permissions for all roles"""
        roles = ["receptionist", "doctor", "nurse", "billing", "admin"]
        
        default_permissions = {
            "receptionist": [
                "dashboard", "appointments", "patients_view", "patients_create", 
                "patients_edit", "patients_profile", "room_management", "bed_management"
            ],
            "doctor": [
                "dashboard", "appointments", "patients_view", "patients_edit", 
                "patients_profile", "medicine_allocation", "lab_reports"
            ],
            "nurse": [
                "dashboard", "patients_view", "patients_profile", "medicine_allocation", 
                "bed_management"
            ],
            "billing": [
                "dashboard", "billing", "pharmacy_billing"
            ],
            "admin": [choice[0] for choice in cls.MODULE_CHOICES]  # All permissions
        }
        
        for role in roles:
            for module, _ in cls.MODULE_CHOICES:
                enabled = module in default_permissions.get(role, [])
                cls.objects.get_or_create(
                    role=role,
                    module=module,
                    defaults={"enabled": enabled}
                )
        print("✅ Default permissions initialized for all roles")

    @classmethod
    def get_role_permissions(cls, role):
        """Get all permissions for a specific role"""
        permissions = cls.objects.filter(role=role)
        return {perm.module: perm.enabled for perm in permissions}
    
    
class MedicineAllocation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medicine_allocations")
    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name="medicine_allocations")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)

    # ✅ changed from ForeignKey → JSONField to store multiple lab report IDs
    lab_report_ids = models.JSONField(default=list, blank=True, null=True)

    medicine_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    quantity = models.CharField(max_length=50, blank=True, null=True)
    frequency = models.CharField(max_length=50, blank=True, null=True)
    duration = models.CharField(max_length=50)
    time = models.CharField(max_length=50, blank=True, null=True)
    allocation_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "medicine_allocations"
        ordering = ["-allocation_date"]

    def __str__(self):
        return f"{self.medicine_name} for {self.patient.full_name} ({self.allocation_date})"
    
class HospitalInvoiceHistory(models.Model):
    STATUS_CHOICES = [
        ("Paid", "Paid"),
        ("Unpaid", "Unpaid"),
        ("Pending", "Pending"),
    ]

    invoice_id = models.CharField(max_length=50, unique=True, blank=True)
    date = models.DateField()
    patient_name = models.CharField(max_length=100)
    patient_id = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)  # Total amount
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")

    admission_date = models.DateField(default=timezone.now)
    discharge_date = models.DateField(null=True, blank=True)
    doctor = models.CharField(max_length=100, default="N/A")
    phone = models.CharField(max_length=20, default="N/A")
    email = models.CharField(max_length=100, default="patient@hospital.com")
    address = models.TextField(default="N/A")

    # Removed: invoice_items = models.JSONField(...)
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=18.0)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.CharField(max_length=50, blank=True, null=True)
    pdf_file = models.FileField(upload_to="generated_invoices/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "hospital_invoice_history"
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.invoice_id} - {self.patient_name}"

    def save(self, *args, **kwargs):
        if not self.invoice_id:
            last = HospitalInvoiceHistory.objects.order_by('-id').first()
            num = 1
            if last and last.invoice_id.startswith("HS_INV_"):
                try:
                    num = int(last.invoice_id.split("_")[-1]) + 1
                except:
                    num = 1
            self.invoice_id = f"HS_INV_{num:04d}"

        # Recalculate total amount from items if items exist
        if self.pk:  # Only if invoice already exists (has items)
            total = sum(item.amount for item in self.items.all())
            tax_amount = total * (self.tax_percent / 100)
            self.amount = total + tax_amount

        super().save(*args, **kwargs)

class HospitalInvoiceItem(models.Model):
    """Line items for hospital invoices - normalized table"""
    invoice = models.ForeignKey(
        HospitalInvoiceHistory,
        on_delete=models.CASCADE,
        related_name="items"  # This allows invoice.items.all()
    )
    
    s_no = models.PositiveSmallIntegerField(help_text="Serial number in invoice")
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "hospital_invoice_item"
        ordering = ['s_no']
        verbose_name = "Hospital Invoice Item"
        verbose_name_plural = "Hospital Invoice Items"

    def __str__(self):
        return f"{self.s_no}. {self.description} - ${self.amount}"

    def save(self, *args, **kwargs):
        # Auto-calculate amount
        self.amount = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        
class PharmacyInvoiceHistory(models.Model):
    """Main invoice table for pharmacy billing"""
    OUTPATIENT = "Outpatient"
    INPATIENT = "Inpatient"
    PATIENT_TYPES = [
        (OUTPATIENT, "Outpatient"),
        (INPATIENT, "Inpatient"),
    ]

    bill_no = models.CharField(max_length=20, unique=True)
    patient_name = models.CharField(max_length=120)
    patient_id = models.CharField(max_length=40)
    age = models.IntegerField()
    doctor_name = models.CharField(max_length=120)
    billing_staff = models.CharField(max_length=120)
    staff_id = models.CharField(max_length=40)
    patient_type = models.CharField(max_length=20, choices=PATIENT_TYPES)
    address_text = models.CharField(max_length=255)
    payment_type = models.CharField(max_length=60)
    payment_status = models.CharField(max_length=60)
    payment_mode = models.CharField(max_length=60)
    bill_date = models.DateField()

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    cgst_percent = models.DecimalField(max_digits=5, decimal_places=2)
    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2)
    sgst_percent = models.DecimalField(max_digits=5, decimal_places=2)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2)

    # ✅ Store generated PDF path
    path = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pharmacy_invoice_history"

    def __str__(self):
        return f"{self.bill_no} - {self.patient_name}"


class PharmacyInvoiceItem(models.Model):
    """Line items table for pharmacy invoice"""
    invoice = models.ForeignKey(
        PharmacyInvoiceHistory,
        on_delete=models.CASCADE,
        related_name="items"
    )
    sl_no = models.IntegerField()
    item_code = models.CharField(max_length=30)
    drug_name = models.CharField(max_length=120)
    rack_no = models.CharField(max_length=20)
    shelf_no = models.CharField(max_length=20)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_pct = models.DecimalField(max_digits=5, decimal_places=2)
    tax_pct = models.DecimalField(max_digits=5, decimal_places=2)
    line_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        db_table = "pharmacy_invoice_item"

    def __str__(self):
        return f"{self.drug_name} ({self.item_code})"
    
# HMS_backend/models.py




        
