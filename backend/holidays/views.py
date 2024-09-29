
from holidays.models import Holiday, Event
from .serializers import EventSerializer,HolidaySerializer
from rest_framework import generics


class EventList(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class HolidayList(generics.ListAPIView):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
