import React from 'react';
import { GameResult } from '../../types/game';
import { TrackComparison } from './TrackComparison';

interface ChallengeTrackListProps {
  originalResults: GameResult[];
  playerResults: GameResult[];
}

export const ChallengeTrackList: React.FC<ChallengeTrackListProps> = ({
  originalResults,
  playerResults,
}) => (
  <div className="space-y-4">
    {originalResults.map((original, index) => (
      <TrackComparison
        key={original.trackId}
        original={original}
        player={playerResults[index]}
      />
    ))}
  </div>
);