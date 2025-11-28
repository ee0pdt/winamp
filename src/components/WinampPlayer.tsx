import React, { useState, useRef } from 'react';
import { TitleBar } from './TitleBar';
import { Display } from './Display';
import { Controls } from './Controls';
import { Sliders } from './Sliders';
import { Playlist } from './Playlist';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import './WinampPlayer.css';

export const WinampPlayer: React.FC = () => {
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showEq, setShowEq] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    state,
    currentTrack,
    playlist,
    analyser,
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
  } = useAudioPlayer();

  const handleEject = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleSelectAndPlay = (index: number) => {
    selectTrack(index);
    setTimeout(() => play(), 100);
  };

  return (
    <div className="winamp-container">
      <div className="winamp-main">
        <TitleBar title="Winamp" />

        <div className="winamp-body">
          <Display
            currentTrack={currentTrack}
            currentTime={state.currentTime}
            duration={state.duration}
            isPlaying={state.isPlaying}
            isPaused={state.isPaused}
            isStopped={state.isStopped}
            bitrate={state.bitrate}
            sampleRate={state.sampleRate}
            analyser={analyser}
            onSeek={seek}
          />

          <Sliders
            volume={state.volume}
            balance={state.balance}
            shuffle={state.shuffle}
            repeat={state.repeat}
            onVolumeChange={setVolume}
            onBalanceChange={setBalance}
            onToggleShuffle={toggleShuffle}
            onToggleRepeat={toggleRepeat}
            onToggleEq={() => setShowEq(!showEq)}
            onTogglePlaylist={() => setShowPlaylist(!showPlaylist)}
            showPlaylist={showPlaylist}
          />

          <Controls
            isPlaying={state.isPlaying}
            isPaused={state.isPaused}
            onPrevious={previous}
            onPlay={play}
            onPause={pause}
            onStop={stop}
            onNext={next}
            onEject={handleEject}
          />
        </div>
      </div>

      {showPlaylist && (
        <Playlist
          tracks={playlist}
          currentTrackIndex={state.currentTrackIndex}
          onSelectTrack={handleSelectAndPlay}
          onRemoveTrack={removeTrack}
          onAddFiles={addFiles}
          onClose={() => setShowPlaylist(false)}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};
