import React from 'react';
import { Trophy, Play } from 'lucide-react';
import { GameResult } from '../types/game';

interface ChallengeModeProps {
  originalResults: GameResult[];
  playerResults: GameResult[];
  onClose: () => void;
  onNewGame: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
  originalResults,
  playerResults,
  onClose,
  onNewGame,
}) => {
  const calculateTotalScore = (results: GameResult[]) => 
    results.reduce((sum, result) => sum + result.score, 0);

  const calculateAverageTime = (results: GameResult[]) => 
    results.reduce((sum, result) => sum + result.time, 0) / results.length;

  const originalTotal = calculateTotalScore(originalResults);
  const playerTotal = calculateTotalScore(playerResults);
  const originalAvgTime = calculateAverageTime(originalResults);
  const playerAvgTime = calculateAverageTime(playerResults);

  const playerWon = playerTotal > originalTotal;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
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

        <div className="space-y-4">
          {originalResults.map((original, index) => {
            const player = playerResults[index];
            return (
              <div key={original.trackId} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={original.albumImage}
                  alt={original.trackName}
                  className="w-12 h-12 rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold dark:text-white">{original.trackName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{original.artistName}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold dark:text-white">
                    {original.score} vs {player?.score || 0}
                  </div>
                  <div className="text-sm text-gray-500">
                    {original.time.toFixed(1)}s vs {player?.time.toFixed(1) || '0.0'}s
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onNewGame}
          className="mt-8 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Play size={20} />
          Start New Game
        </button>
      </div>
    </div>
  );
};