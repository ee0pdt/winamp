import React, { useEffect, useRef, useState } from 'react';
import type { Track } from '../types';
import './Display.css';

interface DisplayProps {
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  bitrate: number;
  sampleRate: number;
  analyser: AnalyserNode | null;
  onSeek: (time: number) => void;
}

export const Display: React.FC<DisplayProps> = ({
  currentTrack,
  currentTime,
  duration,
  isPlaying,
  bitrate,
  sampleRate,
  analyser,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [visualMode, setVisualMode] = useState<'bars' | 'oscilloscope'>('bars');

  const formatTime = (seconds: number): { minutes: string; seconds: string } => {
    if (isNaN(seconds) || !isFinite(seconds)) {
      return { minutes: '00', seconds: '00' };
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const time = formatTime(currentTime);
  const totalTime = formatTime(duration);

  // Visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (visualMode === 'bars') {
          analyser.getByteFrequencyData(dataArray);
          const barWidth = canvas.width / 20;
          const step = Math.floor(bufferLength / 20);

          for (let i = 0; i < 20; i++) {
            const value = dataArray[i * step];
            const percent = value / 255;
            const height = canvas.height * percent;
            const x = i * barWidth;

            // Gradient from green to yellow to red
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#00aa00');
            gradient.addColorStop(0.5, '#aaaa00');
            gradient.addColorStop(1, '#aa0000');

            ctx.fillStyle = gradient;
            ctx.fillRect(x + 1, canvas.height - height, barWidth - 2, height);
          }
        } else {
          analyser.getByteTimeDomainData(dataArray);
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#00ff00';
          ctx.beginPath();

          const sliceWidth = canvas.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            x += sliceWidth;
          }
          ctx.stroke();
        }
      } else {
        // Draw idle pattern
        ctx.fillStyle = '#00ff00';
        for (let i = 0; i < 20; i++) {
          const height = Math.sin(Date.now() / 500 + i * 0.5) * 5 + 8;
          const x = i * (canvas.width / 20);
          ctx.fillRect(x + 1, canvas.height - height, canvas.width / 20 - 2, height);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isPlaying, visualMode]);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      onSeek(percent * duration);
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="winamp-display">
      <div className="display-left">
        <div className="display-status">
          <div className={`status-indicator ${isPlaying ? 'playing' : ''}`}></div>
        </div>
        <div className="display-time">
          <span className="time-digit">{time.minutes[0]}</span>
          <span className="time-digit">{time.minutes[1]}</span>
          <span className="time-colon">:</span>
          <span className="time-digit">{time.seconds[0]}</span>
          <span className="time-digit">{time.seconds[1]}</span>
        </div>
      </div>

      <div className="display-center">
        <div className="display-visualization" onClick={() => setVisualMode(m => m === 'bars' ? 'oscilloscope' : 'bars')}>
          <canvas ref={canvasRef} width={76} height={16} />
        </div>
        <div className="display-info">
          <div className="info-item">
            <span className="info-label">kbps</span>
            <span className="info-value">{bitrate}</span>
          </div>
          <div className="info-item">
            <span className="info-label">kHz</span>
            <span className="info-value">{sampleRate}</span>
          </div>
        </div>
      </div>

      <div className="display-right">
        <div className="display-stereo">
          <span className="stereo-mono">mono</span>
          <span className="stereo-stereo active">stereo</span>
        </div>
      </div>

      <div className="display-marquee" ref={marqueeRef}>
        <div className="marquee-text">
          {currentTrack ? `${currentTrack.artist} - ${currentTrack.title}` : 'WINAMP'}
        </div>
      </div>

      <div className="display-seek" onClick={handleSeekClick}>
        <div className="seek-bar">
          <div className="seek-progress" style={{ width: `${progress}%` }}></div>
          <div className="seek-thumb" style={{ left: `${progress}%` }}></div>
        </div>
      </div>

      <div className="display-duration">
        <span>{totalTime.minutes}:{totalTime.seconds}</span>
      </div>
    </div>
  );
};
