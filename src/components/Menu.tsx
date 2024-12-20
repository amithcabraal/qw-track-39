import React from 'react';
import { History, Share2, Maximize, Sun, Moon, Trophy, Play, LogOut } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useFullscreen } from '../hooks/useFullscreen';
import { useGameHistory } from '../context/GameContext';
import { encodeGameChallenge } from '../utils/challenge';
import { signOut } from '../utils/auth';

interface MenuProps {
  onClose: () => void;
  onShowHistory: () => void;
  onNewGame: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onClose, onShowHistory, onNewGame }) => {
  const { isDark, toggleTheme } = useTheme();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { gameHistory } = useGameHistory();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QuizWordz - Beat the intro',
          text: 'Can you guess these songs faster than me?',
          url: window.location.href
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCreateChallenge = async () => {
    const lastFiveGames = gameHistory.slice(0, 5);
    if (lastFiveGames.length === 0) {
      alert('Play some games first to create a challenge!');
      return;
    }

    const challengeCode = encodeGameChallenge(lastFiveGames);
    const challengeUrl = `${window.location.origin}/challenge/${challengeCode}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QuizWordz Challenge',
          text: 'Can you beat my scores in these songs?',
          url: challengeUrl
        });
      } else {
        await navigator.clipboard.writeText(challengeUrl);
        alert('Challenge link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing challenge:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Menu</h2>
          
          <div className="space-y-2">
            <button
              onClick={onNewGame}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
            >
              <Play className="text-gray-600 dark:text-gray-400" size={20} />
              <span>New Game</span>
            </button>

            <button
              onClick={onShowHistory}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
            >
              <History className="text-gray-600 dark:text-gray-400" size={20} />
              <span>Recent Games</span>
            </button>

            <button
              onClick={handleCreateChallenge}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
            >
              <Trophy className="text-gray-600 dark:text-gray-400" size={20} />
              <span>Create Challenge</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
            >
              <Share2 className="text-gray-600 dark:text-gray-400" size={20} />
              <span>Share</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
            >
              <Maximize className="text-gray-600 dark:text-gray-400" size={20} />
              <span>
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
            >
              {isDark ? 
                <Sun className="text-gray-600 dark:text-gray-400" size={20} /> : 
                <Moon className="text-gray-600 dark:text-gray-400" size={20} />
              }
              <span>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>

            <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
            >
              <LogOut className="text-red-600 dark:text-red-400" size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};