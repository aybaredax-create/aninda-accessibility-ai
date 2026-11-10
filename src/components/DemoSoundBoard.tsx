import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Info, Layers } from 'lucide-react';
import { SOUND_DEFINITIONS, SoundDefinition } from '../data/scenarios';
import { SoundType } from '../types';

interface DemoSoundBoardProps {
  onTriggerSound: (sound: SoundDefinition) => void;
  isListening: boolean;
}

export const DemoSoundBoard: React.FC<DemoSoundBoardProps> = ({
  onTriggerSound,
  isListening,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'HIGH_PRIORITY' | 'IMPORTANT' | 'NORMAL'>('ALL');
  const [autoSimulate, setAutoSimulate] = useState(false);
  const autoSimTimerRef = useRef<any>(null);

  useEffect(() => {
    if (autoSimulate) {
      autoSimTimerRef.current = setInterval(() => {
        const randomSound = SOUND_DEFINITIONS[Math.floor(Math.random() * SOUND_DEFINITIONS.length)];
        onTriggerSound(randomSound);
      }, 5000);
    } else {
      if (autoSimTimerRef.current) {
        clearInterval(autoSimTimerRef.current);
        autoSimTimerRef.current = null;
      }
    }
    return () => {
      if (autoSimTimerRef.current) {
        clearInterval(autoSimTimerRef.current);
      }
    };
  }, [autoSimulate, onTriggerSound]);

  const filteredSounds = SOUND_DEFINITIONS.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  ÇEVRESEL SESLER & DEMO TESTİ
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Demo Modu
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Farklı çevresel ses olaylarını tek tıkla test edin ve arayüz tepkisini görün.
              </p>
            </div>
          </div>
        </div>

        {/* Auto simulation switch */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSimulate(!autoSimulate)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              autoSimulate
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {autoSimulate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoSimulate ? 'Simülasyonu Durdur' : 'Otomatik Akış Simülasyonu'}</span>
          </button>
        </div>
      </div>

      {/* Technical Honesty Note */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>Teknik Not:</strong> Tarayıcı mikrofonu gerçek ses seviyesini (dB) ve konuşmaları ölçer. Çevresel ses sınıflandırma butonları (kapı zili, siren vb.) ise yapay zekâ model davranışını deneyimlemeniz için <strong>Demo Modu</strong> olarak çalışmaktadır.
        </p>
      </div>

      {/* Category selector */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70'
          }`}
        >
          Tüm Sesler ({SOUND_DEFINITIONS.length})
        </button>
        <button
          onClick={() => setActiveCategory('HIGH_PRIORITY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'HIGH_PRIORITY'
              ? 'bg-rose-600 text-white'
              : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100'
          }`}
        >
          🚨 Yüksek Öncelik (Acil)
        </button>
        <button
          onClick={() => setActiveCategory('IMPORTANT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'IMPORTANT'
              ? 'bg-amber-600 text-white'
              : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
          }`}
        >
          🔔 Önemli (Günlük İpuçları)
        </button>
        <button
          onClick={() => setActiveCategory('NORMAL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            activeCategory === 'NORMAL'
              ? 'bg-teal-600 text-white'
              : 'text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100'
          }`}
        >
          🎵 Normal (Arka Plan)
        </button>
      </div>

      {/* Grid of Sound Buttons */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredSounds.map((sound) => {
          const isHighPriority = sound.category === 'HIGH_PRIORITY';
          const isImportant = sound.category === 'IMPORTANT';

          return (
            <button
              key={sound.type}
              onClick={() => onTriggerSound(sound)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isHighPriority
                  ? 'border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 hover:border-rose-400'
                  : isImportant
                  ? 'border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/30 hover:border-amber-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-2xl select-none" aria-hidden="true">
                  {sound.icon}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                    isHighPriority
                      ? 'bg-rose-200/80 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                      : isImportant
                      ? 'bg-amber-200/80 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isHighPriority ? 'ACİL' : isImportant ? 'ÖNEMLİ' : 'NORMAL'}
                </span>
              </div>

              <div>
                <span className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {sound.title}
                </span>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                  {sound.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                <span>{sound.defaultDecibel} dB</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">Tıkla ve Gönder →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
