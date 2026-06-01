from django import forms
from django.core.exceptions import ValidationError
from .models import *

class StaffForm(forms.ModelForm):
    """Form Adding/Editing Staff members"""

    class Meta:
        model = Staff
        fields = [
            'employee_id', 'first_name', 'last_name', 'email', 'phone',
            'role', 'department', 'monthly_target', 'performance_rating',
            'status', 'date_of_joining', 'date_of_birth'
        ]
        widgets = {
            'employee_id' : forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., EMP-001'
            }),
            'first_name' : forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Fisrt Name'
            }),
            'last_name': forms.TextInput(attrs={
                'class' : 'form-control',
                'placeholder': 'Last Name'
            }),
            'email': forms.EmailInput(attrs={
                'class' : 'form-control',
                'placeholder': 'example@gmail.com'
            }),
            'phone': forms.TextInput(attrs={
                'class' : 'form-control',
                'placeholder': '+91 XXXXX XXXXX'
            }),
            'role': forms.Select(attrs={'class':'form-control'}),
            'department': forms.Select(attrs={'class':'form-control'}),
            'monthly_target': forms.NumberInput(attrs={
                'class' : 'form-control',
                'placeholder' : '500000',
                'step' : '0.01'
            }),
            'performance_rating': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': '1',
                'max': '5'
            }),
            'status' : forms.Select(attrs={'class':'form-control'}),
            'date_of_joining': forms.DateInput(attrs={
                'class':'form-control',
                'type':'date'
            }),
            'date_of_birth': forms.DateInput(attrs={
                'class':'form-control',
                'type':'date'
            }),
        }

    def clean_employee_id(self):
        employee_id = self.cleaned_data.get('employee_id')

        # Check if employee ID already exists in DB (Excluding current instance)
        if self.instance.pk:
            if Staff.objects.filter(employee_id=employee_id).exclude(pk=self.instance.pk).exists():
                raise ValidationError('This employee ID already exists!')
        else:
            if Staff.objects.filter(employee_id=employee_id).exists():
                raise ValidationError('This employee ID already exists!')
        
        return employee_id
    
    def clean_email(self):
        email = self.cleaned_data.get('email')

        # Check if email already exists in DB
        if self.instance.pk:
            if Staff.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
                raise ValidationError("This email is already exists!")
        else:
            if Staff.objects.filter(email=email).exists():
                raise ValidationError('This email is already exists!')
        return email
    
    def clean(self):
        cleaned_data = super().clean()

        date_of_birth = cleaned_data.get('date_of_birth')
        date_of_joining = cleaned_data.get('date_of_joining')

        if date_of_birth and date_of_joining:
            if date_of_birth >= date_of_joining:
                raise ValidationError('Date of birth must be before date of joining.')
        return cleaned_data
    
class StaffFilterForm(forms.Form):
    """Form for filtering staff"""
    department = forms.ModelChoiceField(
        queryset=Department.objects.all(),
        empty_label='All Departments',
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    role = forms.ModelChoiceField(
        queryset=StaffRole.objects.all(),
        empty_label='All Roles',
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    status = forms.ChoiceField(
        choices=[('', 'All Status')] + Staff.STATUS_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    search = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search by name, email or ID...'
        })
    )

class StaffQuickEditForm(forms.ModelForm):
    """Quick edit form for inline updates"""
    class Meta:
        model = Staff
        fields = ['status', 'performance_rating', 'monthly_target']
        widgets = {
            'status': forms.Select(attrs={'class': 'form-select-field'}),
            'performance_rating': forms.NumberInput(attrs={
                'class':'form-input-field',
                'min': '1',
                'max': '5',
                }),
            'monthly_target': forms.NumberInput(attrs={
                'class': 'form-input-field',
                'step': '0.01',
            }),
        }

# =========================== STAFF OVERVIER FORM =============================

# ===== LEAD FORM =====
class LeadForm(forms.ModelForm):

    class Meta:
        model = Lead
        fields = ["staff", "name", "phone", "email", "status"]

        widgets = {
            "staff": forms.Select(attrs={"class": "form-control"}),
            "name": forms.TextInput(attrs={"class": "form-control"}),
            "phone": forms.TextInput(attrs={"class": "form-control"}),
            "email": forms.EmailInput(attrs={"class": "form-control"}),
            "status": forms.Select(attrs={"class": "form-control"}),
        }

    def clean_phone(self):
        phone = self.cleaned_data.get("phone")

        if phone and (not phone.isdigit() or len(phone) != 10):
            raise ValidationError("Phone must be 10 digits")

        return phone


# ===== LEAD ACTIVITY =====
class LeadActivityForm(forms.ModelForm):

    class Meta:
        model = LeadActivity
        fields = ["lead", "staff", "activity_type", "title", "description"]

        widgets = {
            "lead": forms.Select(attrs={"class": "form-control"}),
            "staff": forms.Select(attrs={"class": "form-control"}),
            "activity_type": forms.Select(attrs={"class": "form-control"}),
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
        }


# ===== ATTENDANCE FORM =====
class AttendanceForm(forms.ModelForm):

    class Meta:
        model = Attendance
        fields = [
            "staff",
            "date",
            "log_in",
            "log_out",
            "status"
        ]

        widgets = {
            "staff": forms.Select(attrs={"class": "form-control"}),
            "date": forms.DateInput(
                attrs={"type": "date", "class": "form-control"}
            ),
            "log_in": forms.DateTimeInput(
                attrs={"type": "datetime-local", "class": "form-control"}
            ),
            "log_out": forms.DateTimeInput(
                attrs={"type": "datetime-local", "class": "form-control"}
            ),
            "status": forms.Select(
                attrs={"class": "form-control"}
            ),
        }

    def clean(self):
        cleaned_data = super().clean()

        login = cleaned_data.get("log_in")
        logout = cleaned_data.get("log_out")

        if login and logout and logout < login:
            raise ValidationError(
                "Logout time cannot be before login time"
            )

        return cleaned_data


# ===== REVENUE FORM =====
class RevenueForm(forms.ModelForm):

    class Meta:
        model = Revenue
        fields = ["staff", "lead", "amount", "source", "notes"]

        widgets = {
            "staff": forms.Select(attrs={"class": "form-control"}),
            "lead": forms.Select(attrs={"class": "form-control"}),
            "amount": forms.NumberInput(attrs={"class": "form-control"}),
            "source": forms.TextInput(attrs={"class": "form-control"}),
            "notes": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
        }

    def clean_amount(self):
        amount = self.cleaned_data.get("amount")

        if amount is not None and amount <= 0:
            raise ValidationError("Amount must be greater than 0")

        return amount


# ===== SKILL FORM ======
class SkillForm(forms.ModelForm):

    class Meta:
        model = Skill
        fields = ["staff", "skill_name"]

        widgets = {
            "staff": forms.Select(attrs={"class": "form-control"}),
            "skill_name": forms.TextInput(attrs={"class": "form-control"}),
        }

# ================================= DOCUMENT FORM =====================================

