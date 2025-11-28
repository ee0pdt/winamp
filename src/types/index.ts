export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  balance: number;
  shuffle: boolean;
  repeat: boolean;
  currentTrackIndex: number;
  bitrate: number;
  sampleRate: number;
}

export type PlaybackStatus = 'playing' | 'paused' | 'stopped';
