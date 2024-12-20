import React from 'react';
import { Play } from 'lucide-react';

interface NewGameButtonProps {
  onClick: () => void;
}

export const NewGameButton: React.FC<NewGameButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mt-8 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
  >
    <Play size={20} />
    Start New Game
  </button>
);