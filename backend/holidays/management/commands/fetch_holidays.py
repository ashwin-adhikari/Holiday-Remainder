# holidays/management/commands/fetch_holidays.py

import requests
from django.core.management.base import BaseCommand
from holidays.models import Holiday, Event


class Command(BaseCommand):
    help = "Fetch and store holiday data from API"

    def handle(self, *args, **kwargs):
        api_url = "https://api.saralpatro.com/graphql"
        query = """
        query {
            dates(bsYear: 2081) {
                bsDay
                bsMonth
                bsYear
                bsMonthStrEn
                bsMonthStrNp
                isHoliday
                events {
                    strNp
                    strEn
                    isHoliday
                }
            }
        }
        """

        response = requests.post(api_url, json={"query": query})
        print("API Response Status Code:", response.status_code)

        if response.status_code == 200:
            response_data = response.json()

            data = response_data.get("data", {}).get("dates", [])

            if not data:
                self.stdout.write(self.style.ERROR("No data found in API response"))
                return

            for date_data in data:
                is_holiday = date_data.get("isHoliday", False)
                if is_holiday:
                    print(
                        f"Holiday on {date_data['bsDay']}/{date_data['bsMonth']}/{date_data['bsYear']}"
                    )
                    events = date_data.get("events", [])
                    if events:
                        for event in events:
                            if is_holiday:
                                print(
                                    f"Event on this day: {event.get('strEn')}/{event.get('strNp')}"
                                )

                    holiday, created = Holiday.objects.get_or_create(
                        bs_day=date_data["bsDay"],
                        bs_month=date_data["bsMonth"],
                        bs_year=date_data["bsYear"],
                        defaults={
                            "bs_month_en": date_data["bsMonthStrEn"],
                            "bs_month_np": date_data["bsMonthStrNp"],
                            "is_holiday": is_holiday,
                        },
                    )
                    events = date_data.get("events", [])
                    for event in events:
                        event_en = event.get("strEn", "Unknown")
                        event_np = event.get("strNp", "Unknown")
                        Event.objects.get_or_create(
                            holiday=holiday,
                            event_en=event_en,
                            event_np=event_np,
                            is_holiday=event["isHoliday"],
                        )
            self.stdout.write(
                self.style.SUCCESS("Successfully fetched and stored holidays.")
            )

        else:
            self.stdout.write(self.style.ERROR("Failed to fetch data from API"))
