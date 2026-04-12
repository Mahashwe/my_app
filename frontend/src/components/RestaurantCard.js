import React from 'react';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onVote, swipeDirection, showSwipeButtons }) => {
  return (
    <div className={`restaurant-card swipe-card ${swipeDirection ? `swipe-${swipeDirection}` : ''}`}>
      {restaurant.photo_url && (
        <div className="restaurant-image">
          <img src={restaurant.photo_url} alt={restaurant.name} />
        </div>
      )}
      
      <div className="restaurant-content">
        <div className="restaurant-header">
          <h2 className="restaurant-name">{restaurant.name}</h2>
          
          <div className="restaurant-meta">
            {restaurant.rating && (
              <span className="rating">⭐ {restaurant.rating.toFixed(1)}</span>
            )}
            {restaurant.price_level && (
              <span className="price">{restaurant.price_level}</span>
            )}
          </div>
        </div>

        <p className="restaurant-address">{restaurant.address}</p>

        {showSwipeButtons && (
          <div className="vote-buttons-swipe">
            <button
              className="vote-btn dislike-btn"
              onClick={() => onVote(restaurant.id, false, 'left')}
              title="Dislike (Swipe left or press ←)"
            >
              <span className="emoji">❌</span>
              <span className="label">Dislike</span>
            </button>
            <button
              className="vote-btn like-btn"
              onClick={() => onVote(restaurant.id, true, 'right')}
              title="Like (Swipe right or press →)"
            >
              <span className="emoji">✅</span>
              <span className="label">Like</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
