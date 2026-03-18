from rest_framework import serializers
from .models import Session, Participant, Vote
from restaurant_options.serializers import RestaurantSerializer


class ParticipantSerializer(serializers.ModelSerializer):
    """Serializer for Participant model."""
    class Meta:
        model = Participant
        fields = ['id', 'name', 'session', 'joined_at']
        read_only_fields = ['id', 'joined_at']


class VoteSerializer(serializers.ModelSerializer):
    """Serializer for Vote model."""
    restaurant_detail = RestaurantSerializer(source='restaurant', read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'participant', 'restaurant', 'restaurant_detail', 'liked', 'created_at']
        read_only_fields = ['id', 'created_at']


class SessionDetailSerializer(serializers.ModelSerializer):
    """
    Detailed session serializer with all participants and votes.
    """
    participants = ParticipantSerializer(many=True, read_only=True)
    votes = VoteSerializer(many=True, read_only=True, source='participant__votes')

    class Meta:
        model = Session
        fields = ['id', 'code', 'creator_name', 'status', 'created_at', 'updated_at', 'participants', 'votes']
        read_only_fields = ['id', 'code', 'created_at', 'updated_at']


class SessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new session."""
    class Meta:
        model = Session
        fields = ['creator_name']


class SessionSerializer(serializers.ModelSerializer):
    """Basic session serializer."""
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'code', 'creator_name', 'status', 'created_at', 'updated_at', 'participants']
        read_only_fields = ['id', 'code', 'created_at', 'updated_at']
