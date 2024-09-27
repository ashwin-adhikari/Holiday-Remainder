from django.http import JsonResponse
from holidays.models import Holiday

def holiday_list(request):
    holidays = Holiday.objects.all().values()
    return JsonResponse(list(holidays),safe=False)
