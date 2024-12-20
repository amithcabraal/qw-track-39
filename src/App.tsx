import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { GameProvider } from './context/GameContext';
import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <Router>
          <AppRoutes />
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
};