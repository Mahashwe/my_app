import React from 'react';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onVote, hasVoted }) => {
  return (
    <div className="restaurant-card">
      {restaurant.photo_url && (
        <div className="restaurant-image">
          <img src={restaurant.photo_url} alt={restaurant.name} />
        </div>
      )}
      
      <div className="restaurant-content">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        
        <p className="restaurant-address">{restaurant.address}</p>
        
        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating}</span>
          {restaurant.price_level && (
            <span className="price">{restaurant.price_level}</span>
          )}
        </div>

        <div className="vote-buttons">
          <button
            className={`vote-btn like ${hasVoted ? 'voted' : ''}`}
            onClick={() => onVote(restaurant.id, true)}
            disabled={hasVoted}
          >
            👍 Yes
          </button>
          <button
            className={`vote-btn dislike ${hasVoted ? 'voted' : ''}`}
            onClick={() => onVote(restaurant.id, false)}
            disabled={hasVoted}
          >
            👎 No
          </button>
        </div>

        {hasVoted && <p className="voted-text">✓ Your vote recorded</p>}
      </div>
    </div>
  );
};

export default RestaurantCard;
