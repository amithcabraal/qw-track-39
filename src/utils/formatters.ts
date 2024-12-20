export const formatTrackCount = (count: number): string => {
  if (count === 0) return 'No tracks';
  if (count === 1) return '1 track';
  return `${count} tracks`;
};

export const formatTime = (time: number): string => {
  return time.toFixed(1);
};