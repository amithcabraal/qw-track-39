import React, { createContext, useContext, useState } from 'react';
import { GameResult } from '../types/game';

interface GameContextType {
  gameHistory: GameResult[];
  addGameResult: (result: GameResult) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);

  const addGameResult = (result: GameResult) => {
    setGameHistory(prev => [result, ...prev]);
  };

  return (
    <GameContext.Provider value={{ gameHistory, addGameResult }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameHistory = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameHistory must be used within a GameProvider');
  }
  return context;
};