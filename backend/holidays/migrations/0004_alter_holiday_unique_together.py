# Generated by Django 5.0.6 on 2024-09-30 15:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('holidays', '0003_event_event_en'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='holiday',
            unique_together={('bs_day', 'bs_month', 'bs_year')},
        ),
    ]
