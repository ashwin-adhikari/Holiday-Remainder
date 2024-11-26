from django.urls import path
from holidays.views import holidays_view,EventList

urlpatterns = [
     path('holidays/', holidays_view),
     path('events/', EventList.as_view()),
]