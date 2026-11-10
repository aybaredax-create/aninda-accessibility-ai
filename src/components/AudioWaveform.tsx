import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';
import { AudioMetrics } from '../services/audioService';

interface AudioWaveformProps {
  isListening: boolean;
  metrics: AudioMetrics;
  isDarkMode: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isListening,
  metrics,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!isListening) {
      // Idle straight line
      ctx.beginPath();
      ctx.strokeStyle = isDarkMode ? '#334155' : '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    // Draw active audio bars / waveform from frequency data
    const freqData = metrics.frequencyData;
    const barCount = 48;
    const barWidth = width / barCount - 2;

    const baseColor =
      metrics.decibel >= 80
        ? '#ef4444' // Red for loud / alert
        : metrics.decibel >= 65
        ? '#0284c7' // Blue for speech
        : '#0d9488'; // Teal for quiet / normal

    for (let i = 0; i < barCount; i++) {
      const freqIndex = Math.floor((i / barCount) * (freqData.length / 2));
      const value = freqData[freqIndex] || 10;
      const barHeight = Math.max(4, (value / 255) * (height * 0.85));

      const x = i * (barWidth + 2);
      const y = (height - barHeight) / 2;

      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 3);
      ctx.fill();
    }
  }, [isListening, metrics, isDarkMode]);

  // Determine intensity label
  let intensityText = 'Sessiz Ortam';
  let intensityColor = 'text-teal-600 dark:text-teal-400';
  if (metrics.decibel >= 82) {
    intensityText = 'Yüksek Ses Algılandı';
    intensityColor = 'text-rose-600 dark:text-rose-400 font-bold';
  } else if (metrics.decibel >= 62) {
    intensityText = 'Konuşma / Aktif Ses';
    intensityColor = 'text-sky-600 dark:text-sky-400';
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          {isListening ? (
            <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isListening ? 'Canlı Akustik Seviye' : 'Mikrofon Beklemede'}
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className={`text-xs ${intensityColor}`}>
            {isListening ? intensityText : 'Analiz Kapalı'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <span className="font-mono tabular-nums text-sm font-bold text-slate-800 dark:text-slate-100">
            {isListening ? `${metrics.decibel} dB` : '-- dB'}
          </span>
        </div>
      </div>

      {/* Canvas Waveform */}
      <div className="relative w-full h-16 bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={64}
          className="w-full h-full object-cover"
          aria-label="Gerçek zamanlı mikrofon ses dalgası"
        />
        {!isListening && (
          <span className="absolute text-xs text-slate-400 dark:text-slate-500 font-medium">
            Dinleme başlatıldığında canlı ses dalgası burada hareket eder
          </span>
        )}
      </div>

      {/* Meter Bar */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">0 dB</span>
        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              metrics.decibel >= 82
                ? 'bg-rose-500'
                : metrics.decibel >= 62
                ? 'bg-sky-500'
                : 'bg-teal-500'
            }`}
            style={{ width: isListening ? `${metrics.volumePercent}%` : '0%' }}
          />
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">100 dB</span>
      </div>
    </div>
  );
};
