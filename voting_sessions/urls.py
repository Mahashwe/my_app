from django.urls import path
from .views import (
    SessionCreateView,
    SessionDetailView,
    SessionJoinView,
    SessionVoteView,
    SessionResultView,
    SessionFetchRestaurantsView,
)

app_name = 'sessions'

urlpatterns = [
    # Create a new session
    path('create/', SessionCreateView.as_view(), name='create'),
    
    # Get session details (participants, etc.)
    path('<str:code>/', SessionDetailView.as_view(), name='detail'),
    
    # Join an existing session
    path('<str:code>/join/', SessionJoinView.as_view(), name='join'),
    
    # Fetch and link restaurants from Google Places API
    path('<str:code>/fetch-restaurants/', SessionFetchRestaurantsView.as_view(), name='fetch-restaurants'),
    
    # Submit a vote
    path('<str:code>/vote/', SessionVoteView.as_view(), name='vote'),
    
    # Get voting results
    path('<str:code>/result/', SessionResultView.as_view(), name='result'),
]
