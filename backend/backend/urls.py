
from django.urls import path
from holidays.views import holiday_list

urlpatterns = [
     path('holidays/', holiday_list),
]