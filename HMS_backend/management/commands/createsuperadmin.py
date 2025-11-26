from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from HMS_backend.models import Staff, Department


class Command(BaseCommand):
    help = "Create a superadmin user + linked Staff record"

    def handle(self, *args, **kwargs):
        User = get_user_model()

        self.stdout.write(self.style.SUCCESS("\n=== Create Super Admin ==="))

        # --- Step 1: Ask for username ---
        username = input("Enter admin username: ").strip()

        # --- Step 2: Ask for password ---
        password = input("Enter admin password: ").strip()

        # --- Step 3: Ask staff information ---
        full_name = input("Enter full name: ").strip()
        designation = input("Enter designation: ").strip()
        phone = input("Enter phone (unique): ").strip()
        email = input("Enter email (unique): ").strip()

        # --- Validate department ---
        try:
            department = Department.objects.first()
            if department is None:
                self.stdout.write(self.style.ERROR(
                    "❌ No department found. Please create at least one department."
                ))
                return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Department error: {e}"))
            return

        # --- Step 4: Create superuser ---
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR("❌ Username already exists"))
            return

        if Staff.objects.filter(phone=phone).exists():
            self.stdout.write(self.style.ERROR("❌ Phone already exists"))
            return

        if Staff.objects.filter(email=email).exists():
            self.stdout.write(self.style.ERROR("❌ Email already exists"))
            return

        # Create Staff entry first
        staff = Staff.objects.create(
            full_name=full_name,
            designation=designation,
            phone=phone,
            email=email,
            department=department,
        )

        # Create superuser and link staff
        user = User.objects.create_superuser(
                username=username,
                password=password
            )
        user.staff = staff
        user.save()

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Superadmin created successfully!"
        ))
        self.stdout.write(self.style.SUCCESS(
            f"Admin Username: {username}"
        ))
        self.stdout.write(self.style.SUCCESS(
            f"Linked Staff ID: {staff.id}\n"
        ))
