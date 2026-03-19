"""
Service layer for restaurant operations, including Google Places API integration.
"""
import os
import logging
import requests
from typing import List, Dict, Optional

from .models import Restaurant

logger = logging.getLogger(__name__)


class GooglePlacesService:
    """
    Service class for interacting with Google Places API (Nearby Search).
    Fetches nearby restaurants and saves them to the database.
    """
    
    # Google Places API endpoint for nearby search
    API_ENDPOINT = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
    
    def __init__(self):
        """Initialize the service with API key from environment variables."""
        self.api_key = os.getenv('GOOGLE_PLACES_API_KEY')
        if not self.api_key:
            logger.warning(
                'GOOGLE_PLACES_API_KEY not found in environment variables. '
                'Google Places API calls will fail.'
            )
    
    def fetch_and_save_restaurants(
        self,
        latitude: float,
        longitude: float,
        cuisine_type: Optional[str] = None,
        radius: int = 1500,
        limit: int = 5
    ) -> List[Dict]:
        """
        Fetch nearby restaurants from Google Places API and save them to the database.
        
        Args:
            latitude: Latitude coordinate of the search center
            longitude: Longitude coordinate of the search center
            cuisine_type: Optional search keyword (e.g., 'italian', 'sushi', 'burger')
                         If None, returns any nearby restaurants
            radius: Search radius in meters (default: 1500m)
            limit: Maximum number of restaurants to fetch and save (default: 5)
        
        Returns:
            List of dictionaries containing restaurant data:
            [
                {
                    'name': str,
                    'address': str,
                    'rating': float or None,
                    'price_level': str or None,
                    'photo_url': str or None,
                    'place_id': str
                },
                ...
            ]
        
        Raises:
            ValueError: If API key is not configured
            requests.RequestException: If API request fails
        """
        if not self.api_key:
            raise ValueError(
                'GOOGLE_PLACES_API_KEY is not configured. '
                'Please set it in your .env file.'
            )
        
        try:
            # Build request parameters
            params = {
                'location': f'{latitude},{longitude}',
                'radius': radius,
                'key': self.api_key,
                'type': 'restaurant',
            }
            
            # Add keyword if cuisine type is specified
            if cuisine_type:
                params['keyword'] = cuisine_type
            
            logger.info(
                f'Fetching restaurants: lat={latitude}, lon={longitude}, '
                f'cuisine={cuisine_type or "any"}'
            )
            
            # Make API request
            response = requests.get(self.API_ENDPOINT, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Check for API errors
            if data.get('status') != 'OK':
                error_msg = data.get('error_message', data.get('status', 'Unknown error'))
                logger.error(f'Google Places API error: {error_msg}')
                raise ValueError(f'Google Places API error: {error_msg}')
            
            # Process results and save to database
            restaurants = []
            results = data.get('results', [])[:limit]
            
            for place in results:
                restaurant = self._save_restaurant_from_place(place)
                if restaurant:
                    restaurants.append(self._format_restaurant_data(restaurant))
            
            logger.info(f'Successfully fetched and saved {len(restaurants)} restaurants')
            return restaurants
        
        except requests.RequestException as e:
            logger.error(f'Failed to fetch restaurants from Google Places API: {str(e)}')
            raise
        except Exception as e:
            logger.error(f'Unexpected error while fetching restaurants: {str(e)}')
            raise
    
    def _save_restaurant_from_place(self, place_data: Dict) -> Optional[Restaurant]:
        """
        Convert Google Places API response to Restaurant model instance and save.
        
        Args:
            place_data: Single place object from Google Places API response
        
        Returns:
            Restaurant instance if saved successfully, None otherwise
        """
        try:
            place_id = place_data.get('place_id')
            if not place_id:
                logger.warning('Skipping place with no place_id')
                return None
            
            # Extract data from place object
            name = place_data.get('name', '')
            address = place_data.get('vicinity', '')
            rating = place_data.get('rating')
            price_level = place_data.get('price_level')  # 1-4 symbols
            
            # Get photo URL if available
            photo_url = None
            photos = place_data.get('photos', [])
            if photos:
                photo_reference = photos[0].get('photo_reference')
                if photo_reference:
                    # Build Google Places photo URL
                    photo_url = self._build_photo_url(photo_reference)
            
            # Create or update restaurant in database
            restaurant, created = Restaurant.objects.update_or_create(
                place_id=place_id,
                defaults={
                    'name': name,
                    'address': address,
                    'rating': rating,
                    'price_level': price_level,
                    'photo_url': photo_url,
                }
            )
            
            action = 'Created' if created else 'Updated'
            logger.info(f'{action} restaurant: {name} (place_id: {place_id})')
            
            return restaurant
        
        except Exception as e:
            logger.error(f'Error saving restaurant from place data: {str(e)}')
            return None
    
    def _build_photo_url(self, photo_reference: str, max_width: int = 400) -> str:
        """
        Build a direct Google Places photo URL.
        
        Args:
            photo_reference: Photo reference from Google Places API
            max_width: Maximum photo width in pixels (default: 400)
        
        Returns:
            Full photo URL
        """
        return (
            f'https://maps.googleapis.com/maps/api/place/photo'
            f'?maxwidth={max_width}'
            f'&photo_reference={photo_reference}'
            f'&key={self.api_key}'
        )
    
    def _format_restaurant_data(self, restaurant: Restaurant) -> Dict:
        """
        Format a Restaurant instance into a dictionary for API responses.
        
        Args:
            restaurant: Restaurant model instance
        
        Returns:
            Dictionary with restaurant data
        """
        return {
            'id': restaurant.id,
            'name': restaurant.name,
            'address': restaurant.address,
            'rating': restaurant.rating,
            'price_level': restaurant.price_level,
            'photo_url': restaurant.photo_url,
            'place_id': restaurant.place_id,
        }
