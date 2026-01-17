import React, { createContext, useContext, useState, useRef } from 'react';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const playerRef = useRef(null);
  
  // This function will be called by the VideoPlayer component
  // to register its internal ReactPlayer reference
  const registerPlayer = (ref) => {
    playerRef.current = ref;
  };

  const seekTo = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
    }
  };

  const getCurrentTime = () => {
    if (playerRef.current) {
      return playerRef.current.getCurrentTime();
    }
    return 0;
  };

  return (
    <StudyContext.Provider value={{ 
      currentVideoId, 
      setCurrentVideoId, 
      registerPlayer, 
      seekTo, 
      getCurrentTime 
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
