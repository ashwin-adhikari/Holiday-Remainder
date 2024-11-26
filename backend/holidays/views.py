
from holidays.models import Holiday, Event
from .serializers import EventSerializer
from rest_framework import generics

from django.http import JsonResponse

from .management.commands.fetch_holidays import Command as FetchHolidaysCommand



class EventList(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

def holidays_view(request):
    year = request.GET.get('year')
    if year:
        # Check if holidays for the year already exist in the database
        holidays = Holiday.objects.filter(bs_year=year)
        if not holidays.exists():
            # If not, fetch holidays from the API
            command = FetchHolidaysCommand()
            command.handle(year=year)  # Call the handle method with the specified year

        # Fetch updated holidays after fetching
        holidays = Holiday.objects.filter(bs_year=year)

        # Serialize your holiday data to JSON format
        holiday_data = [{
            'bs_day': holiday.bs_day,
            'bs_month': holiday.bs_month,
            'bs_year': holiday.bs_year,
            'bs_month_en': holiday.bs_month_en,
            'bs_month_np': holiday.bs_month_np,
            'weekday_En': holiday.weekday_En,
            'weekday_Np': holiday.weekday_Np,
            'events': [{'event_en': event.event_en, 'event_np': event.event_np} for event in holiday.events.all()]
        } for holiday in holidays]

        return JsonResponse(holiday_data, safe=False)
    else:
        return JsonResponse({'error': 'Year parameter is required'}, status=400)