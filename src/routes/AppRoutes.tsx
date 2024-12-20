import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Callback } from '../pages/Callback';
import { Challenge } from '../pages/Challenge';
import { useAuth } from '../hooks/useAuth';
import { storePendingChallenge } from '../utils/challenge';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Store challenge path if applicable
    if (location.pathname.startsWith('/challenge/')) {
      const code = location.pathname.split('/challenge/')[1];
      storePendingChallenge(code);
    }

    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/callback" element={<Callback />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/challenge/:code"
        element={
          <ProtectedRoute>
            <Challenge />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};