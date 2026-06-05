from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.db.models import Q, Sum
from django.http import JsonResponse, HttpResponse
from django.core.paginator import Paginator
from datetime import datetime
import csv

from .models import *
from .forms import *


# ============================ LIST-VIEW ============================= 


def staff_management(request):
    """Display all staff members with filters and role permissions matrix"""

    queryset = Staff.objects.select_related('role', 'department').order_by('-created_at')

    # Apply filters
    department = request.GET.get('department')
    role = request.GET.get('role')
    status = request.GET.get('status')
    search = request.GET.get('search', '').strip()

    if department:
        queryset = queryset.filter(department__dept_name = department)

    if role:
        queryset = queryset.filter(role_id = role)
    
    if status:
        queryset = queryset.filter(status = status)

    if search:
        queryset = queryset.filter(
            Q(first_name__icontains = search) |
            Q(last_name__icontains = search) |
            Q(email__icontains = search) |
            Q(employee_id__icontains = search)
        )
    # Pagination
    paginator = Paginator(queryset, 15)
    page_number = request.GET.get('page')
    staff_list = paginator.get_page(page_number)

    # Get all roles and departments for filters
    all_roles = StaffRole.objects.all()
    all_departments = Department.objects.all()

    # Role permission Matrix data
    permissions_matrix = [
        {
            'module':'Leads',
            'permission':{
                'admin': 'All',
                'manager': 'All',
                'sales_exec': 'Own',
                'telecaller': 'Own',
                'support': 'View',
                'hr': 'View',
                'trainer': 'View'
            }
        },
        {
            'module': 'Staff',
            'permission':{
                'admin':'All',
                'manager':'View',
                'sales_exec': 'None',
                'telecaller': 'None',
                'support': 'None',
                'hr': 'All',
                'trainer': 'None'
            }
        },
        {
            'module': 'Reports',
            'permission':{
                'admin':'All',
                'manager':'Team',
                'sales_exec':'Own',
                'telecaller': 'None',
                'support': 'None',
                'hr': 'HR',
                'trainer': 'None'
            }
        },
        {
            'module': 'Attendance',
            'permission': {
                'admin': 'All',
                'manager': 'View',
                'sales_exec':'Own',
                'telecaller':  'Own',
                'support': 'Own',
                'hr': 'All',
                'trainer': 'Own'
            }
        }
    ]

    # Filter form
    filter_form = StaffFilterForm(request.GET)

    context = {
        'page_title': 'Staff Management',
        'staff_list': staff_list,
        'filter_form': filter_form,
        'total_staff': queryset.count(),
        'roles': all_roles,
        'departments': all_departments,
        'permissions_matrix': permissions_matrix,
        'paginator': paginator,
        'page_obj': staff_list,
        'is_paginated': staff_list.has_other_pages(),
        'page_obj_number': staff_list.number,
        'search_query': search,
    }
    return render(request, 'staff/management.html', context)

# ========================== AUTO GENERATE EMP ID ==========================

def generate_employee_id():
    last_staff = Staff.objects.order_by('-id').first()

    if last_staff:
        last_id = int(last_staff.employee_id.replace('EMP',''))
        return f"EMP{last_id + 1:03d}"
    
    return "EMP001"

# ========================== CREATE NEW STAFF ==============================

def add_staff(request):
    """Add new staff member"""

    if request.method == 'POST':
        form = StaffForm(request.POST, request.FILES)
        if form.is_valid():
            staff = form.save()
            messages.success(request, f"Staff member '{staff.full_name()}' added successfully!")
            return redirect('staff_management')
    else:
        form = StaffForm(
            initial = {
                'employee_id': generate_employee_id()
            }
        )

    context = {
        'page_title':'Add New Staff',
        'form': form
    }
    return render(request, 'staff/add_staff.html', context)

# ============================= CHECK EMAIL EXISTING (FOR VALIDATION) ===============================

def check_email(request):

    email = request.GET.get('email')
    staff_id = request.GET.get('staff_id')

    email_exists = Staff.objects.filter(
        email=email
    ).exclude(
        id=staff_id
    ).exists()

    return JsonResponse({
        'exists': email_exists
    })

# ======================= CHECK PHONE NO EXISTING (FOR VALIDATION) ====================

def check_phone(request):

    phone = request.GET.get('phone','').strip()
    staff_id = request.GET.get('staff_id')

    phone_exists = Staff.objects.filter(
        phone = phone
    ).exclude(
        id=staff_id
    ).exists()

    return JsonResponse({
        'exists':phone_exists
    })

# ========================== UPDATING STAFF ===================================

def edit_staff(request, id):
    """Update existing staff"""

    staff = get_object_or_404(Staff, id=id)

    if request.method == 'POST':
        form = StaffForm(request.POST, request.FILES, instance=staff)
        if form.is_valid():
            form.save()
            messages.success(request, f"Staff member '{staff.full_name()}' Updated sucessfully!")
        # else:
        #     messages.error(request, 'Please correct the errors below.')
        
        return redirect('staff_management')
    else:
        form = StaffForm(instance=staff)

    context = {
        'page_title':f"Edit '{staff.full_name}'",
        'form':form,
        'staff':staff
    }

    return render(request, 'staff/edit_staff.html', context)

# ============================= STAFF DELETE ==================================

def delete_staff(request, id):
    """Deleting staff member"""

    staff = get_object_or_404(Staff, id=id)

    if request.method == 'POST':
        staff.status = 'terminated'
        staff.save()
        messages.success(request, f"Staff member '{staff.full_name}' terminated!")
        return redirect('staff_management')
        
    context = {
        'page_title': 'Delete Staff',
        'staff': staff,
    }

    return render(request, 'staff/confirm_delete.html', context)

# =========================== QUICK EDIT/AJAX ===================================

def quick_edit_staff(request, id):
    """Quick edit via AJAX"""

    staff = get_object_or_404(Staff, id=id)

    if request.method == 'POST':
        form = StaffQuickEditForm(request.POST, instance=staff)
        if form.is_valid():
            form.save()

            # Check if it's an AJAX request
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': True,
                    'message': 'Updated Successfully'
                })
            else:
                messages.success(request, f"Staff '{staff.full_name}' updated successfully!")
        else:
            # Return JSON error response for AJAX
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'success': False,
                    'errors': form.errors
                })
    else:
        form = StaffQuickEditForm(instance=staff)

    context = {
        'page_title': f'Quick Edit - {staff.full_name}',
        'form': form,
        'staff': staff
    }

    return render(request, 'staff/quick_edit.html', context)

# ============================ EXPORT - STAFF LIST TO CSV ===============================

def export_staff(request):
    """Export staff list as CSV"""

    response = HttpResponse(content_type ='text/csv')
    response['Content-Disposition'] = 'attachement; filename="staff_list.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Employee ID', 'Name', 'Email', 'Phone', 'Role', 'Department',
        'Status', 'Monthly Target', 'Performance Rating', 'Date of Joining'
    ])

    # Get all staff
    staff_list = Staff.objects.select_related('role', 'department').all()

    department = request.GET.get('department')
    role = request.GET.get('role')
    search = request.GET.get('search', '').strip()

    if department:
        staff_list = staff_list.filter(
            department__dept_name=department
        )

    if role:
        staff_list = staff_list.filter(
            role_id=role
        )

    if search:
        staff_list = staff_list.filter(
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(email__icontains=search) |
            Q(employee_id__icontains=search)
        )

    for staff in staff_list:
        writer.writerow([
            staff.employee_id,
            staff.full_name(),
            staff.email,
            staff.phone,
            staff.role.get_role_name_display(),
            staff.department.get_dept_name_display(),
            staff.get_status_display(),
            staff.monthly_target,
            staff.performance_rating,
            staff.date_of_joining.strftime('%d-%m-%Y'),
        ])

    return response

# ================================================ STAFF OVERVIEW ====================================================
# ============================== DASHBOARD ==============================

def overview(request, staff_id=None):

    staff = None

    if staff_id:
        staff = get_object_or_404(Staff, id=staff_id)
    else:
        staff = Staff.objects.filter(status="active").first()

    # SAFE CHECK (IMPORTANT)
    if not staff:
        return render(request, "staff/overview.html", {
            "error": "No staff found"
        })

    leads = Lead.objects.filter(staff=staff)

    assigned_leads = leads.filter(status="assigned").count()
    converted_leads = leads.filter(status="converted").count()
    pending_leads = leads.filter(status__in=["new", "assigned", "in_progress"]).count()

    revenue_qs = Revenue.objects.filter(staff=staff)

    total_revenue = revenue_qs.aggregate(total=Sum("amount"))["total"] or 0

    now = timezone.now()

    this_month_revenue = revenue_qs.filter(
        created_at__month=now.month,
        created_at__year=now.year
    ).aggregate(total=Sum("amount"))["total"] or 0

    last_month_revenue = revenue_qs.filter(
        created_at__month=(now.month - 1 if now.month > 1 else 12),
        created_at__year=now.year
    ).aggregate(total=Sum("amount"))["total"] or 0

    skills = Skill.objects.filter(staff=staff)

    context = {
        "staff": staff,
        "assigned_leads": assigned_leads,
        "converted_leads": converted_leads,
        "pending_leads": pending_leads,
        "total_revenue": total_revenue,
        "this_month_revenue": this_month_revenue,
        "last_month_revenue": last_month_revenue,
        "skills": skills,
    }

    return render(request, "staff/overview.html", context)


# ============================== EDIT ==============================
 
def staff_edit(request, id):

    staff = get_object_or_404(Staff, id=id)

    return render(request, "staff/edit.html", {
        "staff": staff
    })


# ============================== EXPORT CSV ==============================

def staff_export(request, id):

    staff = get_object_or_404(Staff, id=id)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{staff.name}_report.csv"'

    writer = csv.writer(response)

    writer.writerow([
        'Name', 'Email', 'Phone', 'Department', 'Rating'
    ])

    writer.writerow([
        staff.name,
        staff.email,
        staff.phone,
        staff.department,
        staff.performance_rating
    ])

    return response
    
# ==================================================== ATTENDANCE PAGE ====================================================

def attendance_page(request):


    # FILTER VALUES

    date = request.GET.get('date')

    month = request.GET.get('month')

    year = request.GET.get('year')



    # ALL DATA

    attendance_data = Attendance.objects.all().order_by('-date')



    # DATE FILTER

    if date:

        attendance_data = attendance_data.filter(date=date)



    # MONTH FILTER

    if month:

        attendance_data = attendance_data.filter(date__month=month)



    # YEAR FILTER

    if year:

        attendance_data = attendance_data.filter(date__year=year)



    # TOTAL DAYS

    total_working_days = attendance_data.count()



    # PRESENT

    present_days = attendance_data.filter(status='Present').count()



    # ABSENT

    absent_days = attendance_data.filter(status='Absent').count()



    # LEAVE

    leave_days = attendance_data.filter(status='Leave').count()



    # LATE

    late_days = attendance_data.filter(status='Late').count()



    # ATTENDANCE %

    if total_working_days > 0:

        attendance_percentage = int(

            (present_days + late_days)

            / total_working_days * 100

        )

    else:

        attendance_percentage = 0



    # TODAY STATUS

    today = timezone.localdate()



    today_attendance = Attendance.objects.filter(date=today).order_by('-id').first()



    if today_attendance:

        today_status = today_attendance.status

    else:

        today_status = 'Absent'



    context = {

        'attendance_data': attendance_data,

        'total_working_days': total_working_days,

        'present_days': present_days,

        'absent_days': absent_days,

        'leave_days': leave_days,

        'late_days': late_days,

        'attendance_percentage': attendance_percentage,

        'today_status': today_status,

        'today_attendance': today_attendance,

    }



    return render(

        request,

        'staff/attendance.html',

        context

    )


# ========================== STAFF ATTENDANCE ENTRY ============================


def staff_checkin(request):


    if request.method == 'POST':


        # STAFF NAME

        staff_name = request.POST.get('staff_name')


        # BUTTON ACTION

        action = request.POST.get('action')


        # FIND STAFF

        staff = Staff.objects.filter(first_name=staff_name).first()


        if not staff:

            return redirect('staff_checkin')


        # TODAY DATE

        today = timezone.localdate()


        # CURRENT TIME

        current_time = timezone.localtime(timezone.now())


        # FIND TODAY ATTENDANCE

        attendance = Attendance.objects.filter(staff=staff, date=today).first()


        # CREATE ENTRY

        if not attendance:

            attendance = Attendance(staff=staff,date=today)


        # CHECK IN

        if action == 'checkin':


            attendance.log_in = current_time

            office_time = datetime.strptime(
                "09:15",
                "%H:%M"
            ).time()


            if current_time.time() > office_time:

                attendance.status = 'Late'

            else:

                attendance.status = 'Present'
        

        # CHECK OUT

        elif action == 'checkout':


            attendance.log_out = current_time
        # leave
        elif action == 'leave':

            attendance.status = 'Leave'
            attendance.log_in = None
            attendance.log_out = None
            attendance.total_hours = None


         #absent
        elif action == 'absent':

            attendance.status = 'Absent'

            attendance.log_in = None

            attendance.log_out = None

            attendance.total_hours = None
        attendance.save()


        return redirect('attendance')


    return render(

        request,

        'staff/staff_checkin.html'

    )

#======================================== DOCUMENT =========================================
