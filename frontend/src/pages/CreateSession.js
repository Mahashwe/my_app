import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/api';
import './CreateSession.css';

const CreateSession = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createSession(name);
      const sessionCode = response.data.code;
      
      // Store creator name in session storage for WaitingRoom
      sessionStorage.setItem('creatorName', name);
      
      navigate(`/session/${sessionCode}/waiting`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
      setLoading(false);
    }
  };

  return (
    <div className="create-session-container">
      <div className="create-session-content">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        
        <h2>Create New Session</h2>
        <p className="subtext">Start a voting session and invite your friends</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
              maxLength="50"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;
