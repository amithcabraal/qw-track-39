import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCw, ArrowRight, Trophy } from 'lucide-react';
import { SpotifyTrack } from '../types/spotify';
import { usePlayer } from '../hooks/usePlayer';
import { useGameHistory } from '../context/GameContext';
import { calculateSimilarity } from '../utils/similarity';
import { formatTime } from '../utils/formatters';
import { ChallengeMode } from './ChallengeMode';

interface GamePlayerProps {
  track: SpotifyTrack;
  onGameComplete: (score: number) => void;
  onPlayAgain: () => void;
  challengeData?: any;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ track, onGameComplete, onPlayAgain, challengeData }) => {
  const { isPlaying, error, isInitialized, playTrack, togglePlayback } = usePlayer();
  const { addGameResult } = useGameHistory();
  const [timer, setTimer] = useState(0);
  const [isGuessing, setIsGuessing] = useState(false);
  const [titleGuess, setTitleGuess] = useState('');
  const [artistGuess, setArtistGuess] = useState('');
  const [result, setResult] = useState<{ score: number; isCorrect: boolean } | null>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [showingResult, setShowingResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isInitialized) {
      setGameStarted(false);
      setTimer(0);
      setIsGuessing(false);
      setTitleGuess('');
      setArtistGuess('');
      setResult(null);
      setHasStartedPlaying(false);
      setShowingResult(false);
    }
  }, [track, isInitialized]);

  useEffect(() => {
    if (gameStarted && !isGuessing && !showingResult) {
      intervalRef.current = window.setInterval(() => {
        setTimer(prev => prev + 0.1);
      }, 100);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [gameStarted, isGuessing, showingResult]);

  const handleStartGame = async () => {
    if (!isInitialized) return;
    try {
      await playTrack(track);
      setGameStarted(true);
      setHasStartedPlaying(true);
    } catch (err) {
      console.error('Failed to start game:', err);
    }
  };

  const handlePauseAndGuess = async () => {
    await togglePlayback();
    setIsGuessing(true);
  };

  const calculateScore = () => {
    const titleSimilarity = calculateSimilarity(titleGuess, track.name);
    const artistSimilarity = calculateSimilarity(artistGuess, track.artists[0].name);
    const averageSimilarity = (titleSimilarity + artistSimilarity) / 2;
    const timeBonus = Math.max(0, 1 - (timer / 30));
    const score = Math.round((averageSimilarity * 80 + timeBonus * 20) * 100);
    return {
      score,
      isCorrect: titleSimilarity > 0.8 && artistSimilarity > 0.8
    };
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score < 30) return 'text-red-500';
    return 'text-gray-900 dark:text-gray-100';
  };

  const handleSubmitGuess = () => {
    const result = calculateScore();
    setResult(result);
    setShowingResult(true);
    onGameComplete(result.score);
    
    addGameResult({
      trackId: track.id,
      trackName: track.name,
      artistName: track.artists[0].name,
      albumImage: track.album.images[0]?.url || '',
      score: result.score,
      time: timer,
      timestamp: Date.now()
    });
  };

  const handlePlayAgain = () => {
    setTimer(0);
    setIsGuessing(false);
    setTitleGuess('');
    setArtistGuess('');
    setResult(null);
    setHasStartedPlaying(false);
    setShowingResult(false);
    setGameStarted(false);
    onPlayAgain();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 flex items-start justify-center p-4">
      {challengeData && (
        <div className="fixed top-16 left-0 right-0 bg-green-500 text-white py-2 px-4 text-center z-30 flex items-center justify-center gap-2">
          <Trophy size={20} />
          <span>Challenge Mode</span>
        </div>
      )}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-4">
        {error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : !isInitialized ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <span className="ml-2 dark:text-white">Initializing player...</span>
          </div>
        ) : showingResult ? (
          <div className="text-center">
            <div className="mb-6">
              <img
                src={track.album.images[0]?.url}
                alt={track.album.name}
                className="w-48 h-48 mx-auto rounded-lg shadow-md"
              />
            </div>
            <div className={`text-4xl font-bold mb-4 ${getScoreColor(result?.score || 0)}`}>
              {result?.score} points
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold dark:text-white">{track.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">{track.artists[0].name}</p>
            </div>
            <div className="text-gray-600 dark:text-gray-400 mb-6">
              Time: {formatTime(timer)}s
            </div>
            <button
              onClick={handlePlayAgain}
              className="flex items-center justify-center w-full gap-2 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
            >
              {challengeData ? <ArrowRight size={20} /> : <RotateCw size={20} />}
              {challengeData ? 'Next Song' : 'Play Again'}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <div className="text-4xl font-bold mb-2 dark:text-white">{formatTime(timer)}</div>
              <div className="text-gray-600 dark:text-gray-400">seconds</div>
            </div>
            
            {isGuessing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Track Title
                  </label>
                  <input
                    type="text"
                    value={titleGuess}
                    onChange={(e) => setTitleGuess(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter track title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Artist
                  </label>
                  <input
                    type="text"
                    value={artistGuess}
                    onChange={(e) => setArtistGuess(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter artist name..."
                  />
                </div>
                <button
                  onClick={handleSubmitGuess}
                  className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Submit Guess
                </button>
              </div>
            ) : (
              <button
                onClick={gameStarted ? handlePauseAndGuess : handleStartGame}
                className="flex items-center justify-center w-full gap-2 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                {gameStarted ? 'Pause and Guess' : 'Start'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};