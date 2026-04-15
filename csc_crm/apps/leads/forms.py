from django import forms
from .models import *

class Leads_form(forms.ModelForm):

    class Meta:
        model = Lead
        fields = '__all__'
        widgets = {
            'full_name': forms.TextInput(attrs={'placeholder': 'Enter your name'}),
        }

class CallLog_form(forms.ModelForm):

    class Meta:

        model = CallLog
        fields = '__all__'
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

class Follow_up_from(forms.ModelForm):

    class Meta:
        model = Follow_up
        fields = '__all__'
        widgets = {
            'follow_up_date': forms.DateTimeInput(attrs={'type':'datetime-local'}),
            'remarks' : forms.Textarea(attrs={'rows': 3}),
        }
