from django.db import models


class Restaurant(models.Model):
    """
    Represents a restaurant option that can be voted on.
    Data typically comes from Google Places API.
    """
    PRICE_LEVEL_CHOICES = [
        ('$', 'Budget'),
        ('$$', 'Moderate'),
        ('$$$', 'Upscale'),
        ('$$$$', 'Luxury'),
    ]

    # Basic info
    name = models.CharField(max_length=255)
    address = models.TextField()
    
    # Rating from Google Places (0 to 5)
    rating = models.FloatField(null=True, blank=True)
    
    # Price level indicator
    price_level = models.CharField(
        max_length=4,
        choices=PRICE_LEVEL_CHOICES,
        null=True,
        blank=True
    )
    
    # Photo URL from Google Places
    photo_url = models.URLField(null=True, blank=True)
    
    # Google Places ID for reference
    place_id = models.CharField(max_length=255, unique=True, db_index=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return self.name
