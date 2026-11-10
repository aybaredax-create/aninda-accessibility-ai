import React from 'react';
import { Moon, Sun, Vibrate, Type } from 'lucide-react';

interface TopBarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isLargeFont: boolean;
  onToggleFontSize: () => void;
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isDarkMode,
  onToggleTheme,
  isLargeFont,
  onToggleFontSize,
  hapticEnabled,
  onToggleHaptic,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no clutter) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('hero');
            }}
            className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
            aria-label="ANINDA Ana Sayfa"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-base shadow-sm">
              A
            </span>
            <span>ANINDA</span>
          </a>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          aria-label="Ana Gezinti"
        >
          <button
            onClick={() => onNavigate('active-area')}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Canlı Takip
          </button>
          <button
            onClick={() => onNavigate('scenarios')}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Senaryolar
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Nasıl Çalışır?
          </button>
          <button
            onClick={() => onNavigate('about')}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Sosyal Fayda
          </button>
        </nav>

        {/* Zone 3: Accessibility & Utility Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Haptic Toggle */}
          <button
            onClick={onToggleHaptic}
            title={hapticEnabled ? 'Titreşim bildirimi açık' : 'Titreşim bildirimi kapalı'}
            aria-label={hapticEnabled ? 'Titreşim bildirimi açık' : 'Titreşim bildirimi kapalı'}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
              hapticEnabled
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Vibrate className="w-4 h-4" />
          </button>

          {/* Large Font Toggle */}
          <button
            onClick={onToggleFontSize}
            title={isLargeFont ? 'Normal yazı boyutu' : 'Büyük yazı boyutu (Erişilebilirlik)'}
            aria-label={isLargeFont ? 'Normal yazı boyutu' : 'Büyük yazı boyutu (Erişilebilirlik)'}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
              isLargeFont
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span className="flex items-center text-xs tracking-tighter">
              <Type className="w-3.5 h-3.5 mr-0.5" />
              <span>{isLargeFont ? 'A+' : 'A'}</span>
            </span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Açık temaya geç' : 'Karanlık temaya geç'}
            aria-label={isDarkMode ? 'Açık temaya geç' : 'Karanlık temaya geç'}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
