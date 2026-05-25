from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.conf import settings

class Department(models.Model):
    """Department reference data"""
    DEPT_CHOICES = [
        ('sales', 'Sales'),
        ('telecall', 'Telecall'),
        ('support', 'Support'),
        ('trainers', 'Trainers'),
        ('hr', 'HR'),
        ('management', 'Management'),
    ]

    dept_name = models.CharField(max_length=100, unique=True, choices=DEPT_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'
        verbose_name_plural = 'Departments'

    def __str__(self):
        return self.get_dept_name_display()
    
class StaffRole(models.Model):
    """Staff role with permissions"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('sales_executive', 'Sales Executive'),
        ('telecaller', 'Telecaller'),
        ('support', 'Support Staff'),
        ('hr', 'HR'),
        ('trainer', 'Trainer'),
    ]

    role_name = models.CharField(max_length=100, unique=True, choices=ROLE_CHOICES)
    description = models.TextField(blank=True)

    # Permissions
    can_manage_leads = models.BooleanField(default=False)
    can_manage_staff = models.BooleanField(default=False)
    can_view_reports = models.BooleanField(default=False)
    can_mark_attendance = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'staff roles'
        verbose_name_plural = 'Staff Roles'

    def __str__(self):
        return self.get_role_name_display()
    
class Staff(models.Model):
    """Main Staff Model"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('terminated', 'Terminated'),
    ]

    # Basic Information
    employee_id = models.CharField(unique=True, max_length=20, db_index=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=10, unique=True)

    # Role & Department
    role = models.ForeignKey(StaffRole, on_delete=models.PROTECT, related_name='staff_members')
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='staff_members')

    # Performance & Target
    monthly_target = models.DecimalField(max_digits=12, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    performance_rating = models.IntegerField(default=3, validators=[MinValueValidator(0), MaxValueValidator(5)])

    # Status & Dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', db_index=True)
    date_of_joining = models.DateField()
    date_of_birth = models.DateTimeField(null=True, blank=True)

    # Log-in Tracking
    last_login = models.DateTimeField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'staff'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['employee_id']),
            models.Index(fields=['email']),
            models.Index(fields=['status']),
            models.Index(fields=['department'])
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"
    
    def full_name(self):
        """Return Full Name"""
        return f"{self.first_name} {self.last_name}"
    
    def get_initials(self):
        """Get initial from fullname for Avatar"""
        return f"{self.first_name[0]}{self.last_name[0]}".upper()
    
    def get_last_active_time(self):
        '''Returns formatted last active time'''
        if self.last_login:
            return self.last_login.strftime("%d %b %Y, %I:%M %p")
        return "Never"
    
    def get_last_active_simple(self):
        """Returns simple last active status"""
        if not self.last_login:
            return "Never"
        
        now = timezone.now()
        diff = now - self.last_login

        if diff.total_seconds() < 3600:
            return "Today, " + self.last_login.strftime("%I:%M %p")
        elif diff.days == 0:
            return "Today, " + self.last_login.strftime("%I:%M %p")
        elif diff.days == 1:
            return "Yesterday, " + self.last_login.strftime("%I:%M %p")
        else:
            return self.last_login.strftime("%d %b, %I:%M %p")
        
    def get_status_badge_class(self):
        """Return CSS class for status badge"""
        status_classes = {
            'active': 'badge-success',
            'inactive': 'badge-secondary',
            'on_leave' : 'badge-warning',
            'terminated' : 'badge-danger'
        }
        return status_classes.get(self.status, 'badge-secondary')
    
    def get_performance_star_count(self):
        """Return Performance rating as stars (1-5)"""
        return self.performance_rating