from django.contrib import admin
from .models import Location, Service, UserInfo

# Register your models here.
admin.site.register (Location)
admin.site.register (Service)
admin.site.register (UserInfo)
