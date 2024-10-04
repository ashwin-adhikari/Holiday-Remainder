from django.db import models


class Event(models.Model):
    event_np = models.CharField(max_length=255, null=True, blank=True)
    is_holiday = models.BooleanField(default=False)
    event_en = models.CharField(max_length=255, null=True, blank=True )

    def __str__(self):
        return self.event_en

class Holiday(models.Model):
    bs_day = models.IntegerField(default=1)
    bs_month = models.IntegerField(default=1)
    bs_year = models.IntegerField(default=2080)
    bs_month_en = models.CharField(max_length=50)
    is_holiday = models.BooleanField(default=False)
    bs_month_np = models.CharField(max_length=50)
    events = models.ManyToManyField(Event, related_name='holidays')
    
    
    def __str__(self):
        return f"{self.bs_day}/{self.bs_month}/{self.bs_year}"