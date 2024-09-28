# Generated by Django 5.0.6 on 2024-09-27 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holidays', '0002_remove_holiday_date_remove_holiday_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='event_en',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='holiday',
            name='bs_month_en',
            field=models.CharField(default='Unknown', max_length=50),
        ),
        migrations.AlterField(
            model_name='event',
            name='event_np',
            field=models.CharField(default='Unknown', max_length=255),
        ),
    ]
