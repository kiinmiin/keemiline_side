import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { updateGameProgress, isGameUnlocked } from '../utils/progressManager';

const ProgressContext = createContext();

const STORAGE_KEY = 'chemistryApp_progress';

const initialProgress = {
  games: {},
};

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useLocalStorage(STORAGE_KEY, initialProgress);

  const updateProgress = (gameId, results) => {
    setProgress((current) => updateGameProgress(current, gameId, results));
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  const checkGameUnlocked = (gameId) => {
    return isGameUnlocked(gameId, progress);
  };

  const value = {
    progress,
    updateProgress,
    resetProgress,
    checkGameUnlocked,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
