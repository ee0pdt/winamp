import React from 'react';
import './TitleBar.css';

interface TitleBarProps {
  title: string;
  onMinimize?: () => void;
  onShade?: () => void;
  onClose?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ title, onMinimize, onShade, onClose }) => {
  return (
    <div className="winamp-titlebar">
      <div className="titlebar-grip left"></div>
      <div className="titlebar-title">{title}</div>
      <div className="titlebar-grip right"></div>
      <div className="titlebar-buttons">
        <button className="titlebar-btn minimize" onClick={onMinimize} title="Minimize">
          <span></span>
        </button>
        <button className="titlebar-btn shade" onClick={onShade} title="Toggle Shade Mode">
          <span></span>
        </button>
        <button className="titlebar-btn close" onClick={onClose} title="Close">
          <span></span>
        </button>
      </div>
    </div>
  );
};
