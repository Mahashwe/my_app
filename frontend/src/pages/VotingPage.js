import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession, fetchRestaurants, submitVote, getResults } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';
import './VotingPage.css';

const VotingPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [fetchingRestaurants, setFetchingRestaurants] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    loadSession();
  }, [code]);

  const loadSession = async () => {
    try {
      const response = await getSession(code);
      setSession(response.data);
      setRestaurants(response.data.restaurants || []);
      setLoading(false);
    } catch (err) {
      setError('Session not found');
      setLoading(false);
    }
  };

  const handleFetchRestaurants = async () => {
    setFetchingRestaurants(true);
    setError('');
    try {
      // Default location (San Francisco)
      const latitude = localStorage.getItem('latitude') || 37.7749;
      const longitude = localStorage.getItem('longitude') || -122.4194;
      
      await fetchRestaurants(code, latitude, longitude);
      await loadSession();
      setCurrentIndex(0);
    } catch (err) {
      setError('Unable to fetch restaurants. Please check your location.');
    }
    setFetchingRestaurants(false);
  };

  const handleVote = async (restaurantId, liked, direction) => {
    try {
      // Set swipe direction for animation
      setSwipeDirection(direction);
      
      // Submit vote
      await submitVote(code, restaurantId, liked);
      
      // Move to next card after animation
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      }, 300);
    } catch (err) {
      setError('Failed to submit vote');
      setSwipeDirection(null);
    }
  };

  // Handle keyboard votes (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex < restaurants.length) {
        if (e.key === 'ArrowRight') {
          handleVote(restaurants[currentIndex].id, true, 'right');
        } else if (e.key === 'ArrowLeft') {
          handleVote(restaurants[currentIndex].id, false, 'left');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, restaurants]);

  // Handle touch swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (currentIndex >= restaurants.length) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Only detect swipe if vertical movement is minimal
    if (Math.abs(diffY) < 50) {
      if (diffX > 50) {
        // Swiped left (dislike)
        handleVote(restaurants[currentIndex].id, false, 'left');
      } else if (diffX < -50) {
        // Swiped right (like)
        handleVote(restaurants[currentIndex].id, true, 'right');
      }
    }
  };

  if (loading) {
    return <div className="voting-container"><div className="loading">Loading session...</div></div>;
  }

  if (error && !session) {
    return <div className="voting-container"><div className="error">{error}</div></div>;
  }

  const allVoted = currentIndex >= restaurants.length;
  const currentRestaurant = restaurants[currentIndex];

  return (
    <div className="voting-container">
      <div className="voting-header">
        <div className="session-info">
          <h2>Session: <span className="session-code">{code}</span></h2>
          <p className="participants-count">{session?.participants?.length || 0} participants</p>
        </div>
        <button className="leave-btn" onClick={() => navigate('/')}>Home</button>
      </div>

      {restaurants.length === 0 ? (
        <div className="no-restaurants">
          <p>No restaurants yet. Let's find some!</p>
          <button 
            className="btn btn-primary"
            onClick={handleFetchRestaurants}
            disabled={fetchingRestaurants}
          >
            {fetchingRestaurants ? 'Finding restaurants...' : 'Find Nearby Restaurants'}
          </button>
        </div>
      ) : allVoted ? (
        <div className="voting-complete">
          <div className="complete-content">
            <div className="checkmark">✓</div>
            <h2>All Votes Recorded!</h2>
            <p>Waiting for other participants to finish voting...</p>
            <div className="progress-info">
              <p className="progress-text">You voted on {restaurants.length} restaurants</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="voting-swipe-area" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="card-counter">
            {currentIndex + 1} / {restaurants.length}
          </div>

          <div className="swipe-card-container">
            <RestaurantCard
              restaurant={currentRestaurant}
              onVote={handleVote}
              swipeDirection={swipeDirection}
              showSwipeButtons={true}
            />
          </div>

          <div className="swipe-hints">
            <div className="hint hint-left">← Dislike</div>
            <div className="hint hint-right">Like →</div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      )}

      <ParticipantsList participants={session?.participants || []} />
    </div>
  );
};

const ParticipantsList = ({ participants }) => {
  return (
    <div className="participants-panel">
      <h3>Participants ({participants.length})</h3>
      <ul className="participants-list">
        {participants.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default VotingPage;
