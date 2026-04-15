from django.urls import path
from .views import *

urlpatterns = [
    path('create/',create_lead, name='create_lead'),
    path('', lead_list, name='lead_list'),
    path('<int:id>/', lead_detail, name='lead_detail'),
]