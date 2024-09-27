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
                isHoliday
                events {
                    strNp
                    isHoliday
                }
            }
        }
        """

        response = requests.post(api_url, json={"query": query})
        print("API Response Status Code:", response.status_code)
        print("API Response Text:", response.text)

        if response.status_code == 200:
            response_data = response.json()
            print("Parsed Response JSON:", response_data)

            data = response_data.get("data", {}).get("dates", [])

            if not data:
                self.stdout.write(self.style.ERROR("No data found in API response"))
                return

            for date_data in data:
                is_holiday = date_data.get("isHoliday", False)
                if is_holiday:
                    print(
                        f"Holiday found on {date_data['bsDay']}/{date_data['bsMonth']}/{date_data['bsYear']}"
                    )

                    holiday = Holiday.objects.create(
                        bs_day=date_data["bsDay"],
                        bs_month=date_data["bsMonth"],
                        bs_year=date_data["bsYear"],
                        is_holiday=is_holiday,
                    )
                    events = date_data.get("events", [])
                    for event in events:
                        Event.objects.create(
                            holiday=holiday,
                            event_np=event["strNp"],
                            is_holiday=event["isHoliday"],
                        )
            self.stdout.write(
                self.style.SUCCESS("Successfully fetched and stored holidays.")
            )

        else:
            self.stdout.write(self.style.ERROR("Failed to fetch data from API"))
