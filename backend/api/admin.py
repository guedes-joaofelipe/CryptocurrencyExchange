from django.contrib import admin
from .models import Cryptocurrency, Exchange, Price

# Register your models here so you can edit your models through the admin panel.
admin.site.register(Cryptocurrency)
admin.site.register(Exchange)
admin.site.register(Price)