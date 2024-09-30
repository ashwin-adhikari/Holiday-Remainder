

from django.db import models

class Holiday(models.Model):
    bs_day = models.IntegerField(default=1)
    bs_month = models.IntegerField(default=1)
    bs_year = models.IntegerField(default=2080)
    bs_month_en = models.CharField(max_length=50)
    is_holiday = models.BooleanField(default=False)
    bs_month_np = models.CharField(max_length=50)

    
    class Meta:
        unique_together = ['bs_day', 'bs_month', 'bs_year']
    def __str__(self):
        return f"{self.bs_day}/{self.bs_month}/{self.bs_year}"

class Event(models.Model):
    holiday = models.ForeignKey(Holiday, related_name='events', on_delete=models.CASCADE)
    event_np = models.CharField(max_length=255, null=True, blank=True)
    is_holiday = models.BooleanField(default=False)
    event_en = models.CharField(max_length=255, null=True, blank=True )

    def __str__(self):
        return self.event_en
