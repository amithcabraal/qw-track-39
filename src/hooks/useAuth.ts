import { useState, useEffect, useCallback } from 'react';
import { getStoredAccessToken } from '../utils/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getStoredAccessToken()));

  const checkAuth = useCallback(() => {
    const token = getStoredAccessToken();
    setIsAuthenticated(Boolean(token));
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [checkAuth]);

  return { isAuthenticated };
};