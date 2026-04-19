import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateSession from './pages/CreateSession';
import JoinSession from './pages/JoinSession';
import WaitingRoom from './pages/WaitingRoom';
import VotingPage from './pages/VotingPage';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSession />} />
        <Route path="/join" element={<JoinSession />} />
        <Route path="/session/:code/waiting" element={<WaitingRoom />} />
        <Route path="/session/:code" element={<VotingPage />} />
        <Route path="/session/:code/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
