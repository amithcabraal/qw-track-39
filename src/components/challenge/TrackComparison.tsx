import React from 'react';
import { GameResult } from '../../types/game';

interface TrackComparisonProps {
  original: GameResult;
  player?: GameResult;
}

export const TrackComparison: React.FC<TrackComparisonProps> = ({ original, player }) => {
  console.log('TrackComparison - Original:', original);
  console.log('TrackComparison - Player:', player);

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex-shrink-0">
        <img
          src={original.albumImage}
          alt={original.trackName}
          className="w-16 h-16 rounded-lg object-cover shadow-md"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-lg truncate dark:text-white">
          {original.trackName}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {original.artistName}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-lg dark:text-white space-x-1">
          <span className="text-green-500">{original.score}</span>
          <span className="text-gray-400">vs</span>
          <span className="text-blue-500">{player?.score || 0}</span>
        </div>
        <div className="text-sm text-gray-500 space-x-1">
          <span>{original.time.toFixed(1)}s</span>
          <span>vs</span>
          <span>{player?.time.toFixed(1) || '0.0'}s</span>
        </div>
      </div>
    </div>
  );
};