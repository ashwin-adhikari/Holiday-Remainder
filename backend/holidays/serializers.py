# holidays/serializers.py

from rest_framework import serializers
from .models import Holiday, Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_np', 'is_holiday']

class HolidaySerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Holiday
        fields = ['bs_day', 'bs_month', 'bs_year', 'is_holiday']
