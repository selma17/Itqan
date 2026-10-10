const pad = (n) => n.toString().padStart(2, '0');

// 75 -> "01:15"
export const formatTimer = (seconds) => `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

// 3725 -> "1س 2د 5ث"
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}س ${mins}د ${secs}ث`;
  if (mins > 0) return `${mins}د ${secs}ث`;
  return `${secs}ث`;
};
