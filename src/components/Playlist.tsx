import React, { useRef } from 'react';
import type { Track } from '../types';
import { TitleBar } from './TitleBar';
import './Playlist.css';

interface PlaylistProps {
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  onRemoveTrack: (index: number) => void;
  onAddFiles: (files: FileList) => void;
  onClose: () => void;
}

export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  currentTrackIndex,
  onSelectTrack,
  onRemoveTrack,
  onAddFiles,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);

  return (
    <div className="winamp-playlist">
      <TitleBar title="Winamp Playlist" onClose={onClose} />

      <div className="playlist-content">
        <div className="playlist-list">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`playlist-item ${index === currentTrackIndex ? 'active' : ''}`}
              onClick={() => onSelectTrack(index)}
              onDoubleClick={() => onSelectTrack(index)}
            >
              <span className="track-number">{index + 1}.</span>
              <span className="track-info">
                {track.artist} - {track.title}
              </span>
              <span className="track-duration">{formatDuration(track.duration)}</span>
              <button
                className="track-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTrack(index);
                }}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="playlist-controls">
          <div className="playlist-buttons">
            <button className="pl-control-btn add" onClick={handleAddClick}>
              + ADD
            </button>
            <button
              className="pl-control-btn rem"
              onClick={() => onRemoveTrack(currentTrackIndex)}
            >
              - REM
            </button>
            <button className="pl-control-btn sel">SEL</button>
            <button className="pl-control-btn misc">MISC</button>
          </div>
        </div>

        <div className="playlist-info">
          <span>{tracks.length} track(s)</span>
          <span>{formatDuration(totalDuration)}</span>
        </div>
      </div>

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
