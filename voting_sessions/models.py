import uuid
from django.db import models
from restaurant_options.models import Restaurant


class Session(models.Model):
    """
    Represents a restaurant voting session.
    Users can join via a unique code and vote on restaurant options.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    # Unique code for sharing (e.g., "ABC123")
    code = models.CharField(max_length=10, unique=True, db_index=True)
    
    # Creator's name
    creator_name = models.CharField(max_length=100)
    
    # Session status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Session {self.code} by {self.creator_name}"


class Participant(models.Model):
    """
    Represents a person who joined a session.
    """
    # Participant's name
    name = models.CharField(max_length=100)
    
    # Foreign key to the session
    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        related_name='participants'
    )
    
    # When they joined
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['joined_at']

    def __str__(self):
        return f"{self.name} in {self.session.code}"


class Vote(models.Model):
    """
    Represents a like/dislike vote on a restaurant.
    """
    # Foreign key to participant
    participant = models.ForeignKey(
        Participant,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    
    # Foreign key to restaurant
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='votes'
    )
    
    # Whether they liked it (True) or disliked it (False)
    liked = models.BooleanField()
    
    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('participant', 'restaurant')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.participant.name} {'liked' if self.liked else 'disliked'} {self.restaurant.name}"
