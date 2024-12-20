import React from 'react';
import { SpotifyPlaylist } from '../types/spotify';
import { PlaylistImage } from './PlaylistImage';
import { formatTrackCount } from '../utils/formatters';

interface PlaylistSelectorProps {
  playlists: SpotifyPlaylist[];
  onSelect: (playlist: SpotifyPlaylist) => void;
  challengeData?: any;
}

export const PlaylistSelector: React.FC<PlaylistSelectorProps> = ({ playlists, onSelect, challengeData }) => {
  if (challengeData) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Challenge Mode
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get ready to beat {challengeData.length} tracks!
        </p>
        <button
          onClick={() => onSelect({ id: 'challenge', name: 'Challenge Mode', tracks: { total: challengeData.length } } as SpotifyPlaylist)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Start Challenge
        </button>
      </div>
    );
  }

  if (!playlists.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          No Playlists Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Create some playlists in Spotify to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {playlists.map((playlist) => (
        <button
          key={playlist.id}
          onClick={() => onSelect(playlist)}
          className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <PlaylistImage playlist={playlist} />
          <div className="ml-4 text-left">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
              {playlist.name || 'Untitled Playlist'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTrackCount(playlist.tracks?.total ?? 0)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};