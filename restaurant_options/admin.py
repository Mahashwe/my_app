from django.contrib import admin
from .models import Restaurant


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'rating', 'price_level']
    list_filter = ['price_level', 'rating']
    search_fields = ['name', 'address', 'place_id']
    readonly_fields = ['place_id', 'created_at', 'updated_at']
