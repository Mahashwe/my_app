import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionCode, setSessionCode] = useState(null);
  const [participantName, setParticipantName] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetSession = () => {
    setSessionCode(null);
    setParticipantName(null);
    setSessionData(null);
    setError(null);
  };

  return (
    <SessionContext.Provider
      value={{
        sessionCode,
        setSessionCode,
        participantName,
        setParticipantName,
        sessionData,
        setSessionData,
        Loading,
        setLoading,
        error,
        setError,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};
