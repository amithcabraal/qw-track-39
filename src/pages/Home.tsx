import React, { useState, useEffect } from 'react';
import { PlaylistSelector } from '../components/PlaylistSelector';
import { GamePlayer } from '../components/GamePlayer';
import { Header } from '../components/Header';
import { ChallengeMode } from '../components/challenge/ChallengeMode';
import { SpotifyPlaylist, SpotifyTrack } from '../types/spotify';
import { getUserPlaylists, getPlaylistTracks, getTrackById } from '../services/spotifyApi';
import { GameResult } from '../types/game';

interface HomeProps {
  challengeData?: GameResult[];
}

export const Home: React.FC<HomeProps> = ({ challengeData }) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playedTracks, setPlayedTracks] = useState<Set<string>>(new Set());
  const [isReadyForNextTrack, setIsReadyForNextTrack] = useState(true);
  const [playerResults, setPlayerResults] = useState<GameResult[]>([]);
  const [showChallengeResults, setShowChallengeResults] = useState(false);

  useEffect(() => {
    if (!challengeData) {
      getUserPlaylists()
        .then(data => {
          setPlaylists(data.items);
        })
        .catch(error => {
          console.error('Failed to fetch playlists:', error);
          setError('Failed to load playlists. Please try again.');
        });
    } else if (challengeData.length > 0 && isReadyForNextTrack) {
      const currentIndex = playedTracks.size;
      console.log('Challenge Data at index', currentIndex, ':', challengeData[currentIndex]);
      
      if (currentIndex < challengeData.length) {
        getTrackById(challengeData[currentIndex].trackId)
          .then(track => {
            console.log('Retrieved track from Spotify:', track);
            setCurrentTrack(track);
            setIsReadyForNextTrack(false);
          })
          .catch(error => {
            console.error('Failed to fetch challenge track:', error);
            setError('Failed to load challenge track');
          });
      } else if (currentIndex === challengeData.length) {
        console.log('Challenge complete. Player results:', playerResults);
        console.log('Original challenge data:', challengeData);
        setShowChallengeResults(true);
      }
    }
  }, [challengeData, playedTracks, isReadyForNextTrack]);

  const handleGameComplete = (score: number) => {
    if (currentTrack) {
      let gameResult: GameResult;
      
      if (challengeData) {
        // Use challenge data for the current track
        const currentChallengeTrack = challengeData[playedTracks.size];
        console.log('Creating game result from challenge track:', currentChallengeTrack);
        console.log('Current track from Spotify:', currentTrack);
        
        gameResult = {
          trackId: currentTrack.id,
          trackName: currentTrack.name, // Changed from currentChallengeTrack.trackName
          artistName: currentTrack.artists[0].name, // Changed from currentChallengeTrack.artistName
          albumImage: currentTrack.album.images[0]?.url || '', // Changed from currentChallengeTrack.albumImage
          score,
          time: Number(document.querySelector('.text-4xl.font-bold.mb-2')?.textContent?.replace('s', '') || 0),
          timestamp: Date.now()
        };
        
        console.log('Created game result:', gameResult);
      } else {
        // Normal game mode
        gameResult = {
          trackId: currentTrack.id,
          trackName: currentTrack.name,
          artistName: currentTrack.artists[0].name,
          albumImage: currentTrack.album.images[0]?.url || '',
          score,
          time: Number(document.querySelector('.text-4xl.font-bold.mb-2')?.textContent?.replace('s', '') || 0),
          timestamp: Date.now()
        };
      }

      if (challengeData) {
        console.log('Adding game result to player results:', gameResult);
        setPlayerResults(prev => [...prev, gameResult]);
      }
      
      setPlayedTracks(prev => new Set([...prev, currentTrack.id]));
    }
  };

  const handlePlayAgain = () => {
    setIsReadyForNextTrack(true);
    if (!challengeData && currentPlaylist) {
      handlePlaylistSelect(currentPlaylist);
    }
  };

  const handleNewGame = () => {
    setCurrentTrack(null);
    setCurrentPlaylist(null);
    setPlayedTracks(new Set());
    setPlayerResults([]);
    setShowChallengeResults(false);
    setIsReadyForNextTrack(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header onNewGame={handleNewGame} />
      
      <main className="pt-16">
        {showChallengeResults && challengeData ? (
          <ChallengeMode
            originalResults={challengeData}
            playerResults={playerResults}
            onClose={handleNewGame}
            onNewGame={handleNewGame}
          />
        ) : !currentTrack ? (
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {challengeData ? 'Challenge Mode' : 'Your Playlists'}
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
            <PlaylistSelector 
              playlists={playlists} 
              onSelect={handlePlaylistSelect}
              challengeData={challengeData}
            />
          </div>
        ) : (
          <GamePlayer 
            track={currentTrack} 
            onGameComplete={handleGameComplete}
            onPlayAgain={handlePlayAgain}
            challengeData={challengeData}
          />
        )}
      </main>
    </div>
  );
};