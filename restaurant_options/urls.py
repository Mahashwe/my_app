from django.urls import path
from .views import RestaurantListView, RestaurantCreateView

app_name = 'restaurants'

urlpatterns = [
    # List all restaurants
    path('', RestaurantListView.as_view(), name='list'),
    
    # Create a new restaurant
    path('create/', RestaurantCreateView.as_view(), name='create'),
]
