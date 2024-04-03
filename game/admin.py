from django.contrib import admin

from .models import Order, Trader

admin.site.register(Trader)
admin.site.register(Order)
