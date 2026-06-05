from django.urls import path
from .views import *

urlpatterns = [
    path('management/', staff_management, name='staff_management'),
    path('add/', add_staff, name='add_staff'),
    path('<int:id>/edit/', edit_staff, name='edit_staff'),
    path('<int:id>/delete/', delete_staff, name='delete_staff'),
    path('<int:id>/quick-edit', quick_edit_staff, name='quick_edit_staff'),
    path('export/', export_staff, name='export_staff'), 
    # STAFF OVERVIEW URLS
    path('overview/<int:staff_id>', overview, name='overview'),
    path('staff/edit/<int:id>/', staff_edit, name='staff_edit'),
    path('export/', staff_export, name='staff_export'),
    # STAFF ATTENDANCE
    path('attendance/', attendance_page, name='attendance'),
    path('staff-checkin/', staff_checkin, name='staff_checkin'),

    # VALIDATION (EMAIL)
    path('check-email/', check_email, name='check_email'),
    path('check-phone/', check_phone, name='check_phone'),
]