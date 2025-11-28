import React from 'react';
import './Controls.css';

interface ControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPrevious: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onEject: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  isPaused,
  onPrevious,
  onPlay,
  onPause,
  onStop,
  onNext,
  onEject,
}) => {
  return (
    <div className="winamp-controls">
      <div className="controls-playback">
        <button className="control-btn previous" onClick={onPrevious} title="Previous">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="4" width="3" height="12" />
            <polygon points="18,4 18,16 6,10" />
          </svg>
        </button>
        <button className={`control-btn play ${isPlaying && !isPaused ? 'active' : ''}`} onClick={onPlay} title="Play">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <polygon points="4,2 4,18 18,10" />
          </svg>
        </button>
        <button className={`control-btn pause ${isPaused ? 'active' : ''}`} onClick={onPause} title="Pause">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <rect x="3" y="2" width="5" height="16" />
            <rect x="12" y="2" width="5" height="16" />
          </svg>
        </button>
        <button className="control-btn stop" onClick={onStop} title="Stop">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <rect x="3" y="3" width="14" height="14" />
          </svg>
        </button>
        <button className="control-btn next" onClick={onNext} title="Next">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <polygon points="2,4 2,16 14,10" />
            <rect x="15" y="4" width="3" height="12" />
          </svg>
        </button>
        <button className="control-btn eject" onClick={onEject} title="Open File">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <polygon points="10,2 2,12 18,12" />
            <rect x="2" y="15" width="16" height="3" />
          </svg>
        </button>
      </div>
    </div>
  );
};
