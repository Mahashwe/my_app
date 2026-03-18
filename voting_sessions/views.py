from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import string
import random
from django.shortcuts import get_object_or_404

from .models import Session, Participant, Vote
from .serializers import (
    SessionSerializer,
    SessionDetailSerializer,
    SessionCreateSerializer,
    ParticipantSerializer,
    VoteSerializer,
)
from restaurant_options.models import Restaurant


def generate_session_code(length=6):
    """Generate a random alphanumeric session code."""
    chars = string.ascii_letters + string.digits
    code = ''.join(random.choices(chars, k=length))
    return code


class SessionCreateView(APIView):
    """
    POST /api/sessions/create/
    Create a new session with a unique code.
    
    Request body:
    {
        "creator_name": "John"
    }
    """
    def post(self, request):
        serializer = SessionCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Generate a unique session code
            code = generate_session_code()
            while Session.objects.filter(code=code).exists():
                code = generate_session_code()

            # Create the session
            session = Session.objects.create(
                code=code,
                creator_name=serializer.validated_data['creator_name']
            )

            return Response(
                SessionSerializer(session).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SessionDetailView(APIView):
    """
    GET /api/sessions/<code>/
    Get details of a session including participants and votes.
    """
    def get(self, request, code):
        session = get_object_or_404(Session, code=code)
        serializer = SessionDetailSerializer(session)
        return Response(serializer.data)


class SessionJoinView(APIView):
    """
    POST /api/sessions/<code>/join/
    Join an existing session.
    
    Request body:
    {
        "name": "Jane"
    }
    """
    def post(self, request, code):
        session = get_object_or_404(Session, code=code)

        # Validate that name is provided
        name = request.data.get('name')
        if not name:
            return Response(
                {'error': 'name field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create participant
        participant = Participant.objects.create(
            name=name,
            session=session
        )

        serializer = ParticipantSerializer(participant)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SessionVoteView(APIView):
    """
    POST /api/sessions/<code>/vote/
    Submit a vote on a restaurant for the session.
    
    Request body:
    {
        "participant_id": 1,
        "restaurant_id": 5,
        "liked": true
    }
    """
    def post(self, request, code):
        session = get_object_or_404(Session, code=code)

        # Validate input data
        participant_id = request.data.get('participant_id')
        restaurant_id = request.data.get('restaurant_id')
        liked = request.data.get('liked')

        if not all([participant_id is not None, restaurant_id is not None, liked is not None]):
            return Response(
                {'error': 'participant_id, restaurant_id, and liked are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify participant belongs to this session
        participant = get_object_or_404(
            Participant,
            id=participant_id,
            session=session
        )
        restaurant = get_object_or_404(Restaurant, id=restaurant_id)

        # Create or update vote
        vote, created = Vote.objects.update_or_create(
            participant=participant,
            restaurant=restaurant,
            defaults={'liked': liked}
        )

        serializer = VoteSerializer(vote)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)


class SessionResultView(APIView):
    """
    GET /api/sessions/<code>/result/
    Get the voting results for a session.
    Returns restaurants sorted by like count with voting stats.
    """
    def get(self, request, code):
        session = get_object_or_404(Session, code=code)

        # Get all votes for this session
        votes = Vote.objects.filter(
            participant__session=session
        ).select_related('restaurant')

        # Build results: count likes/dislikes per restaurant
        results = {}
        for vote in votes:
            restaurant_id = vote.restaurant.id
            if restaurant_id not in results:
                results[restaurant_id] = {
                    'restaurant': {
                        'id': vote.restaurant.id,
                        'name': vote.restaurant.name,
                        'address': vote.restaurant.address,
                        'rating': vote.restaurant.rating,
                        'price_level': vote.restaurant.price_level,
                        'photo_url': vote.restaurant.photo_url,
                    },
                    'likes': 0,
                    'dislikes': 0,
                }

            if vote.liked:
                results[restaurant_id]['likes'] += 1
            else:
                results[restaurant_id]['dislikes'] += 1

        # Sort by likes (descending)
        sorted_results = sorted(
            results.values(),
            key=lambda x: x['likes'],
            reverse=True
        )

        return Response({
            'session_code': session.code,
            'status': session.status,
            'total_participants': session.participants.count(),
            'results': sorted_results
        })
