# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-02 11:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_userinfo_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('loc_code1', models.IntegerField()),
                ('loc_code2', models.IntegerField()),
                ('loc_code3', models.IntegerField()),
            ],
        ),
        migrations.RemoveField(
            model_name='userinfo',
            name='location1',
        ),
        migrations.RemoveField(
            model_name='userinfo',
            name='location2',
        ),
        migrations.RemoveField(
            model_name='userinfo',
            name='location3',
        ),
        migrations.AddField(
            model_name='userinfo',
            name='locations',
            field=models.ManyToManyField(related_name='_userinfo_locations_+', to='user.Location'),
        ),
    ]
