from django.urls import path
from holidays.views import HolidayList,EventList

urlpatterns = [
     path('holidays/', HolidayList.as_view()),
     path('events/', EventList.as_view()),
]