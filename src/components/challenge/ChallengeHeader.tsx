import React from 'react';
import { Trophy } from 'lucide-react';

interface ChallengeHeaderProps {
  playerWon: boolean;
  originalTotal: number;
  playerTotal: number;
  originalAvgTime: number;
  playerAvgTime: number;
}

export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
  playerWon,
  originalTotal,
  playerTotal,
  originalAvgTime,
  playerAvgTime,
}) => (
  <>
    <div className="text-center mb-8">
      <Trophy 
        size={48} 
        className={playerWon ? 'text-yellow-500 mx-auto' : 'text-gray-400 mx-auto'} 
      />
      <h2 className="text-2xl font-bold mt-4 dark:text-white">
        Challenge Results
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        {playerWon ? 'Congratulations! You won!' : 'Nice try! Better luck next time!'}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="text-center">
        <h3 className="font-semibold mb-2 dark:text-white">Challenger</h3>
        <p className="text-3xl font-bold text-green-500">{originalTotal}</p>
        <p className="text-sm text-gray-500">{originalAvgTime.toFixed(1)}s avg</p>
      </div>
      <div className="text-center">
        <h3 className="font-semibold mb-2 dark:text-white">You</h3>
        <p className="text-3xl font-bold text-blue-500">{playerTotal}</p>
        <p className="text-sm text-gray-500">{playerAvgTime.toFixed(1)}s avg</p>
      </div>
    </div>
  </>
);