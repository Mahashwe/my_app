# Views for restaurants app
# Can be extended with Google Places API integration

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Restaurant
from .serializers import RestaurantSerializer


class RestaurantListView(APIView):
    """
    GET /api/restaurants/
    List all restaurants (useful for testing).
    """
    def get(self, request):
        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response(serializer.data)


class RestaurantCreateView(APIView):
    """
    POST /api/restaurants/
    Create a new restaurant. Typically called from Google Places API integration.
    
    Request body:
    {
        "name": "Pizza Place",
        "address": "123 Main St",
        "rating": 4.5,
        "price_level": "$$",
        "photo_url": "https://...",
        "place_id": "ChIJN1blbpBBZakRzzdSinSTzzI"
    }
    """
    def post(self, request):
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
