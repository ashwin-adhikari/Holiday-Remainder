# Generated by Django 5.0.6 on 2024-09-28 15:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('holidays', '0002_remove_event_event_en'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='event_en',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
