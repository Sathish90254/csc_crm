from django import forms
from .models import *

class LeadCaptureForm(forms.ModelForm):

    class Meta:
        model = LeadCapture
        fields = '__all__'
        exclude = ['lead_id', 'created_at', 'updated_at']
        widgets = {
            'enquiry_date': forms.DateInput(attrs={'type':'date'}),
            'next_followup_date':forms.DateInput(attrs={'type': 'date'}),
        }

# Call-log form
class CallLogForm(forms.ModelForm):
    class Meta:
        model = CallLog
        fields = '__all__'