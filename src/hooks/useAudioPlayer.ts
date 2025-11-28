import { useState, useRef, useCallback, useEffect } from 'react';
import type { Track, PlayerState } from '../types';

const DEMO_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Demo Track 1',
    artist: 'Winamp Demo',
    duration: 180,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Demo Track 2',
    artist: 'Winamp Demo',
    duration: 240,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Demo Track 3',
    artist: 'Winamp Demo',
    duration: 200,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [playlist, setPlaylist] = useState<Track[]>(DEMO_TRACKS);
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    isPaused: false,
    isStopped: true,
    currentTime: 0,
    duration: 0,
    volume: 75,
    balance: 0,
    shuffle: false,
    repeat: false,
    currentTrackIndex: 0,
    bitrate: 128,
    sampleRate: 44,
  });

  const currentTrack = playlist[state.currentTrackIndex] || null;

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && audioRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      initAudioContext();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false, isStopped: false }));
    }
  }, [initAudioContext]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true, isStopped: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ ...prev, isPlaying: false, isPaused: false, isStopped: true, currentTime: 0 }));
    }
  }, []);

  const previous = useCallback(() => {
    setState(prev => {
      let newIndex: number;
      if (prev.shuffle) {
        newIndex = Math.floor(Math.random() * playlist.length);
      } else {
        newIndex = prev.currentTrackIndex > 0 ? prev.currentTrackIndex - 1 : playlist.length - 1;
      }
      return { ...prev, currentTrackIndex: newIndex };
    });
  }, [playlist.length]);

  const next = useCallback(() => {
    setState(prev => {
      let newIndex: number;
      if (prev.shuffle) {
        newIndex = Math.floor(Math.random() * playlist.length);
      } else {
        newIndex = prev.currentTrackIndex < playlist.length - 1 ? prev.currentTrackIndex + 1 : 0;
      }
      return { ...prev, currentTrackIndex: newIndex };
    });
  }, [playlist.length]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    setState(prev => ({ ...prev, volume }));
  }, []);

  const setBalance = useCallback((balance: number) => {
    setState(prev => ({ ...prev, balance }));
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => ({ ...prev, repeat: !prev.repeat }));
  }, []);

  const selectTrack = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentTrackIndex: index }));
  }, []);

  const addFiles = useCallback((files: FileList) => {
    const newTracks: Track[] = [];
    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const name = file.name.replace(/\.[^/.]+$/, '');
        newTracks.push({
          id: `local-${Date.now()}-${index}`,
          title: name,
          artist: 'Local File',
          duration: 0,
          url,
        });
      }
    });
    if (newTracks.length > 0) {
      setPlaylist(prev => [...prev, ...newTracks]);
    }
  }, []);

  const removeTrack = useCallback((index: number) => {
    setPlaylist(prev => prev.filter((_, i) => i !== index));
    setState(prev => {
      if (prev.currentTrackIndex >= index && prev.currentTrackIndex > 0) {
        return { ...prev, currentTrackIndex: prev.currentTrackIndex - 1 };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = state.volume / 100;

    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleDurationChange = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      setState(prev => {
        if (prev.repeat) {
          audio.currentTime = 0;
          audio.play();
          return prev;
        }
        const newIndex = prev.currentTrackIndex < playlist.length - 1 ? prev.currentTrackIndex + 1 : 0;
        return { ...prev, currentTrackIndex: newIndex, isPlaying: true };
      });
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = state.isPlaying;
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      if (wasPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [state.currentTrackIndex, currentTrack?.url]);

  return {
    state,
    currentTrack,
    playlist,
    analyser: analyserRef.current,
    play,
    pause,
    stop,
    previous,
    next,
    setVolume,
    setBalance,
    seek,
    toggleShuffle,
    toggleRepeat,
    selectTrack,
    addFiles,
    removeTrack,
  };
}
