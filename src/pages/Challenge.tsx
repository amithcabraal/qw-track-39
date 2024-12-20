import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home } from './Home';
import { decodeGameChallenge } from '../utils/challenge';
import { useAuth } from '../hooks/useAuth';

export const Challenge: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [challengeData, setChallengeData] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      if (!isAuthenticated) {
        // Redirect to login with challenge path
        navigate('/login', { 
          state: { from: `/challenge/${code}` },
          replace: true 
        });
        return;
      }

      try {
        const decoded = decodeGameChallenge(code);
        setChallengeData(decoded);
      } catch (error) {
        console.error('Invalid challenge code:', error);
        navigate('/', { replace: true });
      }
    }
  }, [code, isAuthenticated, navigate]);

  if (!challengeData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return <Home challengeData={challengeData} />;
};