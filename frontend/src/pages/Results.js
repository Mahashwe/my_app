import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResults } from '../services/api';
import './Results.css';

const Results = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    loadResults();
  }, [code]);

  const loadResults = async () => {
    try {
      const response = await getResults(code);
      setData(response.data);
      
      if (!response.data.results || response.data.results.length === 0) {
        setError('No votes yet. Be the first to vote!');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load results');
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!data?.results || data.results.length === 0) return;

    const winner = data.results[0].restaurant;
    const shareText = `We're going to ${winner.name}! 📍 ${winner.address}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
    }).catch(() => {
      setShareMessage('Failed to copy');
    });
  };

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>{error}</h2>
          <button className="btn btn-primary" onClick={handlePlayAgain}>
            Start a New Session
          </button>
        </div>
      </div>
    );
  }

  const winner = data?.results?.[0];
  const runners = data?.results?.slice(1) || [];
  const totalVotes = data?.total_participants || 0;

  return (
    <div className="results-container">
      {/* Confetti Animation */}
      <div className="confetti-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 1}s`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C7CEEA'][Math.floor(Math.random() * 5)],
            }}
          />
        ))}
      </div>

      {/* Winner Section */}
      <div className="winner-section">
        <div className="confetti-emoji">🎉</div>
        <h1 className="winner-headline">That's the Spot!</h1>

        {winner && (
          <div className="winner-card">
            {winner.restaurant.photo_url && (
              <div className="winner-photo">
                <img src={winner.restaurant.photo_url} alt={winner.restaurant.name} />
              </div>
            )}

            <div className="winner-details">
              <h2 className="winner-name">{winner.restaurant.name}</h2>

              <div className="rating-section">
                {winner.restaurant.rating && (
                  <div className="rating">
                    <span className="stars">⭐ {winner.restaurant.rating}</span>
                  </div>
                )}
              </div>

              {winner.restaurant.price_level && (
                <div className="price-level">
                  <span className="price-indicator">{winner.restaurant.price_level}</span>
                </div>
              )}

              <div className="address">
                <span className="address-icon">📍</span>
                <span className="address-text">{winner.restaurant.address}</span>
              </div>

              <div className="like-count">
                👍 {winner.likes} out of {totalVotes} {totalVotes === 1 ? 'person' : 'people'} liked this!
              </div>
            </div>
          </div>
        )}

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={handlePlayAgain}>
            🏠 Play Again
          </button>
          <button className="btn btn-secondary" onClick={handleShare}>
            📋 Share
          </button>
        </div>

        {shareMessage && <div className="share-message">{shareMessage}</div>}
      </div>

      {/* Runners Up Section */}
      {runners.length > 0 && (
        <div className="runners-section">
          <h2 className="runners-title">The Rest of the Ballot</h2>
          <div className="runners-list">
            {runners.map((result, index) => (
              <div key={result.restaurant.id} className="runner-card">
                <div className="runner-rank">#{index + 2}</div>
                
                {result.restaurant.photo_url && (
                  <div className="runner-photo">
                    <img src={result.restaurant.photo_url} alt={result.restaurant.name} />
                  </div>
                )}

                <div className="runner-info">
                  <h3 className="runner-name">{result.restaurant.name}</h3>
                  
                  <div className="runner-details">
                    {result.restaurant.rating && (
                      <span className="runner-rating">⭐ {result.restaurant.rating}</span>
                    )}
                    {result.restaurant.price_level && (
                      <span className="runner-price">{result.restaurant.price_level}</span>
                    )}
                  </div>

                  <div className="runner-address">{result.restaurant.address}</div>
                  
                  <div className="runner-votes">
                    👍 {result.likes} like{result.likes !== 1 ? 's' : ''} • 👎 {result.dislikes} dislike{result.dislikes !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
