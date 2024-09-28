# Generated by Django 5.0.6 on 2024-09-28 11:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holidays', '0007_alter_holiday_unique_together'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_en',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='event_np',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='holiday',
            name='bs_month_en',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='holiday',
            name='bs_month_np',
            field=models.CharField(max_length=50),
        ),
    ]
