import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Where Tonight?</h1>
        <p className="home-subtitle">Stop arguing about where to eat. Vote and decide together!</p>
        
        <div className="home-actions">
          <Link to="/create" className="btn btn-primary btn-large">
            Create New Session
          </Link>
          <Link to="/join" className="btn btn-secondary btn-large">
            Join Existing Session
          </Link>
        </div>

        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>Create</h3>
            <p>Start a new voting session</p>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <h3>Invite</h3>
            <p>Share the code with friends</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✅</span>
            <h3>Vote</h3>
            <p>Vote yes or no on restaurants</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <h3>Decide</h3>
            <p>See the winning restaurant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
