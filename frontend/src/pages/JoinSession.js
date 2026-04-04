import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinSession } from '../services/api';
import './JoinSession.css';

const JoinSession = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Please enter both session code and your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await joinSession(code.toUpperCase(), name);
      navigate(`/session/${code.toUpperCase()}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join session. Please check the code.');
      setLoading(false);
    }
  };

  return (
    <div className="join-session-container">
      <div className="join-session-content">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        
        <h2>Join Session</h2>
        <p className="subtext">Enter the session code shared by your friends</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="code">Session Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              disabled={loading}
              maxLength="6"
              style={{ textTransform: 'uppercase', letterSpacing: '2px' }}
            />
          </div>

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
            {loading ? 'Joining...' : 'Join Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinSession;
