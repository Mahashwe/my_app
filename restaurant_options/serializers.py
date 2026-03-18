from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    """Serializer for Restaurant model."""
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'rating', 'price_level', 'photo_url', 'place_id', 'created_at']
        read_only_fields = ['id', 'created_at']
