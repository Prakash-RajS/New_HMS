# fastapi_app/django_setup.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_project.settings")  
# replace `my_project` with your actual Django project folder name

django.setup()
