import React from 'react';
import { GameResult } from '../../types/game';
import { ChallengeHeader } from './ChallengeHeader';
import { ChallengeTrackList } from './ChallengeTrackList';
import { NewGameButton } from './NewGameButton';
import { calculateGameStats } from '../../utils/gameStats';

interface ChallengeModeProps {
  originalResults: GameResult[];
  playerResults: GameResult[];
  onClose: () => void;
  onNewGame: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
  originalResults,
  playerResults,
  onNewGame,
}) => {
  console.log('ChallengeMode - Original Results:', originalResults);
  console.log('ChallengeMode - Player Results:', playerResults);

  const { 
    originalTotal, 
    playerTotal, 
    originalAvgTime, 
    playerAvgTime, 
    playerWon 
  } = calculateGameStats(originalResults, playerResults);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <ChallengeHeader
          playerWon={playerWon}
          originalTotal={originalTotal}
          playerTotal={playerTotal}
          originalAvgTime={originalAvgTime}
          playerAvgTime={playerAvgTime}
        />

        <ChallengeTrackList
          originalResults={originalResults}
          playerResults={playerResults}
        />

        <NewGameButton onClick={onNewGame} />
      </div>
    </div>
  );
};