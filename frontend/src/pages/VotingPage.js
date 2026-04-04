import React, { useState, useEffect } from 'react';
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
  const [votedRestaurants, setVotedRestaurants] = useState(new Set());
  const [fetchingRestaurants, setFetchingRestaurants] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
    } catch (err) {
      setError('Unable to fetch restaurants. Please check your location.');
    }
    setFetchingRestaurants(false);
  };

  const handleVote = async (restaurantId, liked) => {
    try {
      await submitVote(code, restaurantId, liked);
      setVotedRestaurants(new Set([...votedRestaurants, restaurantId]));
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  const handleViewResults = () => {
    setShowResults(true);
  };

  if (loading) {
    return <div className="voting-container"><div className="loading">Loading session...</div></div>;
  }

  if (error && !session) {
    return <div className="voting-container"><div className="error">{error}</div></div>;
  }

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
      ) : (
        <div className="voting-content">
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onVote={handleVote}
                hasVoted={votedRestaurants.has(restaurant.id)}
              />
            ))}
          </div>

          <div className="voting-actions">
            <button className="btn btn-primary" onClick={handleViewResults}>
              View Results
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {showResults && (
        <ResultsModal code={code} onClose={() => setShowResults(false)} />
      )}

      <ParticipantsList participants={session?.participants || []} />
    </div>
  );
};

const ResultsModal = ({ code, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [code]);

  const loadResults = async () => {
    try {
      const response = await getResults(code);
      setResults(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vote Results</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="results-list">
          {results.length === 0 ? (
            <p>No votes yet</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-rank">#{index + 1}</div>
                <div className="result-details">
                  <h3>{result.restaurant.name}</h3>
                  <p className="result-address">{result.restaurant.address}</p>
                  <div className="result-stats">
                    <span className="rating">⭐ {result.restaurant.rating}</span>
                  </div>
                </div>
                <div className="result-votes">
                  <div>
                    <span className="vote-count like">{result.likes}</span>
                    <p>Likes</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const ParticipantsList = ({ participants }) => {
  return (
    <div className="participants-panel">
      <h3>Participants</h3>
      <ul className="participants-list">
        {participants.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default VotingPage;
