from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from .forms import *

# Create Lead
def create_lead(request):
    if request.method == 'POST':
        form = Leads_form(request.POST)
        if form.is_valid():
            form.save()
            # return redirect('lead_list')
    else:
        form = Leads_form()

    return render(request, 'leads/create_lead.html', {'form': form})
    
# List All Leads
def lead_list(request):
    leads = Lead.objects.all().order_by('-created_at')

    return render(request, 'leads/lead_list.html', {'leads':leads})

# Lead Detail View
def lead_detail(request, id):
    lead = get_object_or_404(Lead, id=id)

    call_logs = lead.call_logs.all().order_by('-call_time')
    follow_ups = lead.followups.all().order_by('-follow_up_date')

    call_form = CallLog_form()
    follow_form = Follow_up_from()

    return render(request, 'leads/lead_detail.html', {
        'lead': lead,
        'call_logs': call_logs,
        'follow_ups': follow_ups,
        'call_form': call_form,
        'follow_form': follow_form
    })