import requests
import json
from django.core.management.base import BaseCommand
from holidays.models import Holiday, Event


class Command(BaseCommand):
    help = "Fetch and store holiday data from API"

    def add_arguments(self, parser):
        parser.add_argument(
            '--year',
            type=int,
            default=2081,
            help='The Nepali year for which to fetch holidays (e.g., 2081)', 
        )

    def handle(self, *args, **kwargs):
        year = kwargs['year']
        api_url = "https://api.saralpatro.com/graphql"
        query = f"""
        query {{
            dates(bsYear: {year}) {{
                bsDay
                bsMonth
                bsYear
                bsMonthStrEn
                bsMonthStrNp
                weekdayStrEn
                weekdayStrNp
                isHoliday
                events {{ 
                    strNp
                    strEn
                    isHoliday
                    }}
            }}
        }}
        """

        try:
            response = requests.post(api_url, json={"query": query})
            print("API Response Status Code:", response.status_code)

            if response.status_code == 200:
                response_data = response.json()

                data = response_data.get("data", {}).get("dates", [])

                if not data:
                    self.stdout.write(self.style.ERROR("No data found in API response"))
                    return

                holidays_data = []

                for date_data in data:
                    is_holiday = date_data.get("isHoliday", False)
                    if is_holiday:
                        print(
                            f"Holiday on {date_data['bsDay']}/{date_data['bsMonth']}/{date_data['bsYear']}"
                        )
                        
                        # Create or get the holiday instance
                        holiday, created = Holiday.objects.get_or_create(
                            bs_day=date_data["bsDay"],
                            bs_month=date_data["bsMonth"],
                            bs_year=date_data["bsYear"],
                            bs_month_en=date_data["bsMonthStrEn"],
                            bs_month_np=date_data["bsMonthStrNp"],
                            weekday_En=date_data["weekdayStrEn"],
                            weekday_Np=date_data["weekdayStrNp"],
                            defaults={"is_holiday": is_holiday},
                        )

                        # Collect the holiday data for JSON file
                        holidays_data.append({
                            "bsDay": date_data["bsDay"],
                            "bsMonth": date_data["bsMonth"],
                            "bsYear": date_data["bsYear"],
                            "bsMonthStrEn": date_data["bsMonthStrEn"],
                            "bsMonthStrNp": date_data["bsMonthStrNp"],
                            "weekdayStrEn": date_data["weekdayStrEn"],
                            "weekdayStrNp": date_data["weekdayStrNp"],
                            "events": [],
                        })

                        # Process events and create event instances
                        events = date_data.get("events", [])
                        for event in events:
                            event_en = event.get("strEn", "").strip()
                            event_np = event.get("strNp", "").strip()
                            event_holiday = event.get("isHoliday", False)

                            # Create or get the event instance
                            event_instance, event_created = Event.objects.get_or_create(
                                event_en=event_en,
                                event_np=event_np,
                                is_holiday=event_holiday,
                            )

                            # Add event to the holiday instance
                            holiday.events.add(event_instance)

                            # Append event data to the holiday record
                            holidays_data[-1]["events"].append({
                                "strEn": event_en,
                                "strNp": event_np,
                                "isHoliday": event_holiday,
                            })

                self.stdout.write(self.style.SUCCESS("Successfully fetched and stored holidays."))

            else:
                self.stdout.write(self.style.ERROR("Failed to fetch data from API"))
        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f"Error during API call: {str(e)}"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {str(e)}"))
