import { GameResult } from '../types/game';

interface GameStats {
  originalTotal: number;
  playerTotal: number;
  originalAvgTime: number;
  playerAvgTime: number;
  playerWon: boolean;
}

export const calculateGameStats = (
  originalResults: GameResult[],
  playerResults: GameResult[]
): GameStats => {
  const calculateTotalScore = (results: GameResult[]) => 
    results.reduce((sum, result) => sum + result.score, 0);

  const calculateAverageTime = (results: GameResult[]) => 
    results.reduce((sum, result) => sum + result.time, 0) / results.length;

  const originalTotal = calculateTotalScore(originalResults);
  const playerTotal = calculateTotalScore(playerResults);
  const originalAvgTime = calculateAverageTime(originalResults);
  const playerAvgTime = calculateAverageTime(playerResults);
  const playerWon = playerTotal > originalTotal;

  return {
    originalTotal,
    playerTotal,
    originalAvgTime,
    playerAvgTime,
    playerWon
  };
};