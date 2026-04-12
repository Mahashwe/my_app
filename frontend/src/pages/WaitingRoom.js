import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../services/api';
import './WaitingRoom.css';

const WaitingRoom = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const pollInterval = useRef(null);
  const creatorName = useRef(
    sessionStorage.getItem('creatorName') || 
    sessionStorage.getItem('participantName') || 
    null
  );

  useEffect(() => {
    // Load session data immediately
    loadSession();

    // Set up polling every 3 seconds
    pollInterval.current = setInterval(loadSession, 3000);

    // Cleanup on unmount
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [code]);

  const loadSession = async () => {
    try {
      const response = await getSession(code);
      setSession(response.data);
      setParticipants(response.data.participants || []);
      setError('');
      setLoading(false);
    } catch (err) {
      setError('Failed to load session');
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleBeginVoting = () => {
    // Store session data for use in voting page
    sessionStorage.setItem('sessionCode', code);
    sessionStorage.setItem('participantCount', participants.length);
    
    // Navigate to voting page
    navigate(`/session/${code}`);
  };

  const isCreator = creatorName.current === session?.creator_name;

  if (loading) {
    return (
      <div className="waiting-room-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="waiting-room-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="waiting-room-container">
      {/* Header */}
      <div className="waiting-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        {isCreator && <div className="creator-badge">You're the host</div>}
      </div>

      {/* Session Code Section */}
      <div className="code-section">
        <p className="code-label">Session Code</p>
        <div className="code-display-container">
          <div className="code-display">
            <span className="code-text">{code}</span>
          </div>
          <button 
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopyCode}
            title="Copy code to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
        <p className="share-hint">Share this code with friends</p>
      </div>

      {/* Participants Section */}
      <div className="participants-section">
        <h2 className="participants-title">Participants ({participants.length})</h2>
        <div className="participants-grid">
          {participants.length === 0 ? (
            <p className="no-participants">Waiting for participants to join...</p>
          ) : (
            participants.map((participant) => (
              <div key={participant.id} className="participant-card">
                <div className="participant-avatar">
                  {getInitials(participant.name)}
                </div>
                <span className="participant-name">{participant.name}</span>
                {participant.name === creatorName.current && (
                  <span className="host-label">Host</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Begin Voting Button */}
      {isCreator && (
        <div className="action-section">
          <button 
            className="btn btn-primary btn-large btn-begin"
            onClick={handleBeginVoting}
            disabled={participants.length === 0}
            title={participants.length === 0 ? 'At least one participant required' : 'Start the voting session'}
          >
            Begin Voting
          </button>
          <p className="action-hint">
            {participants.length === 0 
              ? 'Share the code and wait for friends to join' 
              : 'Ready to start voting with everyone'}
          </p>
        </div>
      )}

      {/* Non-creator waiting message */}
      {!isCreator && (
        <div className="waiting-message">
          <p>Waiting for the host to start the voting session...</p>
          <div className="waiting-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="refresh-indicator">
        <span className="refresh-dot"></span>
        <span className="refresh-text">Updates every 3 seconds</span>
      </div>
    </div>
  );
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export default WaitingRoom;
