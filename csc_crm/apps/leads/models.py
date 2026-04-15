from django.db import models
from django.contrib.auth.models import User

# Lead Model
class Lead(models.Model):

    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('interested', 'Interested'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    ]

    MODE = [
        ('online', 'Online'),
        ('offline', 'Offline')
    ]

    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('call', 'Call'),
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('walkin', 'Walk-In'),
        ('referral', 'Referral'),
    ]

    #Basic Information of Leads
    full_name = models.CharField(max_length=100,)
    email = models.EmailField(blank=True, null=True, unique=True)
    phone_no = models.CharField(unique=True, max_length=12)
    address = models.TextField(null=True)

    #Cource interested
    course_interested = models.CharField(max_length=100)
    mode = models.CharField(max_length=100, choices=MODE, default='offline')

    # Source and Status of Leads
    source = models.CharField(max_length=100, choices=SOURCE_CHOICES)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='new')

    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

    def __str__(self):
        return self.full_name

# Call-Log Model
class CallLog(models.Model):

    CALL_TYPE_CHOICES = [
        ('incomming', 'Incomming'),
        ('outgoing', 'Outgoing')
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='call_logs')

    call_type = models.CharField(max_length=20, choices=CALL_TYPE_CHOICES)
    call_time = models.TimeField(auto_now_add=True)
    duration = models.IntegerField(help_text="Duration in seconds")

    notes = models.TextField()

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.lead.full_name} - {self.call_type}"
    
# Follow-Up
class Follow_up(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('done', 'Done'),
        ('missed', 'Missed'),
    ]

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='followups')
    follow_up_date = models.DateTimeField()
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='pending')
    remarks = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.lead.full_name} - {self.follow_up_date}"