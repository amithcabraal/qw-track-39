import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginButton } from '../components/LoginButton';
import { storePendingChallenge } from '../utils/challenge';

export const Login: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Store challenge code if coming from challenge URL
    const challengePath = location.state?.from;
    if (challengePath?.startsWith('/challenge/')) {
      const code = challengePath.split('/challenge/')[1];
      storePendingChallenge(code);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">Beat the Intro</h1>
      <LoginButton />
    </div>
  );
};