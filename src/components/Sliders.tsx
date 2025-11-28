import React, { useRef } from 'react';
import './Sliders.css';

interface SlidersProps {
  volume: number;
  balance: number;
  shuffle: boolean;
  repeat: boolean;
  onVolumeChange: (volume: number) => void;
  onBalanceChange: (balance: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleEq: () => void;
  onTogglePlaylist: () => void;
  showPlaylist: boolean;
}

export const Sliders: React.FC<SlidersProps> = ({
  volume,
  balance,
  shuffle,
  repeat,
  onVolumeChange,
  onBalanceChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleEq,
  onTogglePlaylist,
  showPlaylist,
}) => {
  const volumeRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeRef.current) {
      const rect = volumeRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      onVolumeChange(percent);
    }
  };

  const handleBalanceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (balanceRef.current) {
      const rect = balanceRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = ((x / rect.width) * 200) - 100;
      onBalanceChange(Math.max(-100, Math.min(100, percent)));
    }
  };

  return (
    <div className="winamp-sliders">
      <div className="sliders-row">
        <div className="slider-group volume">
          <div className="slider-track" ref={volumeRef} onClick={handleVolumeClick}>
            <div className="slider-fill" style={{ width: `${volume}%` }}></div>
            <div className="slider-thumb" style={{ left: `${volume}%` }}></div>
            <div className="slider-ticks">
              {[...Array(28)].map((_, i) => (
                <div key={i} className={`tick ${i % 7 === 0 ? 'major' : ''}`}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="slider-group balance">
          <div className="slider-track" ref={balanceRef} onClick={handleBalanceClick}>
            <div
              className="slider-fill-center"
              style={{
                left: balance < 0 ? `${50 + balance / 2}%` : '50%',
                width: `${Math.abs(balance) / 2}%`
              }}
            ></div>
            <div className="slider-thumb" style={{ left: `${(balance + 100) / 2}%` }}></div>
            <div className="slider-ticks">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`tick ${i === 5 || i === 6 ? 'center' : ''}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sliders-buttons">
        <button className={`eq-btn ${false ? 'active' : ''}`} onClick={onToggleEq}>
          EQ
        </button>
        <button className={`pl-btn ${showPlaylist ? 'active' : ''}`} onClick={onTogglePlaylist}>
          PL
        </button>
      </div>

      <div className="sliders-toggles">
        <button className={`toggle-btn shuffle ${shuffle ? 'active' : ''}`} onClick={onToggleShuffle}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6h3l3 4-3 4H2v-2h2l2-2-2-2H2V6zm12 0h4v2h-2l-2 2 2 2h2v2h-4l-3-4 3-4z"/>
            <path d="M14 4v3l4-3.5L14 0v3h-2l-2.5 3h2.1L14 4zm0 12v-3l4 3.5-4 3.5v-3h-2l-2.5-3h2.1l2.4 3z"/>
          </svg>
        </button>
        <button className={`toggle-btn repeat ${repeat ? 'active' : ''}`} onClick={onToggleRepeat}>
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 6h12v2H4zm0 6h12v2H4z"/>
            <path d="M14 3v3l4-3-4-3v3zm-8 14v-3l-4 3 4 3v-3z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
