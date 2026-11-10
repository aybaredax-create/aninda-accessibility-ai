import React, { useState } from 'react';
import { Clock, Filter, Trash2, ShieldAlert } from 'lucide-react';
import { SoundEvent, SoundPriority } from '../types';

interface SoundTimelineProps {
  events: SoundEvent[];
  onClearEvents: () => void;
  onSelectEvent?: (event: SoundEvent) => void;
}

export const SoundTimeline: React.FC<SoundTimelineProps> = ({
  events,
  onClearEvents,
  onSelectEvent,
}) => {
  const [filter, setFilter] = useState<'ALL' | SoundPriority | 'SPEECH'>('ALL');

  const filteredEvents = events.filter((ev) => {
    if (filter === 'ALL') return true;
    return ev.category === filter;
  });

  const getCategoryStyles = (category: SoundPriority | 'SPEECH') => {
    switch (category) {
      case 'HIGH_PRIORITY':
        return {
          badgeBg: 'bg-rose-100 dark:bg-rose-950/80',
          badgeText: 'text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          badgeLabel: 'YÜKSEK ÖNCELİK',
          cardBorder: 'border-rose-300 dark:border-rose-800/80',
          cardBg: 'bg-rose-50/50 dark:bg-rose-950/20',
        };
      case 'IMPORTANT':
        return {
          badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
          badgeText: 'text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          badgeLabel: 'ÖNEMLİ',
          cardBorder: 'border-amber-200/80 dark:border-amber-800/60',
          cardBg: 'bg-amber-50/30 dark:bg-amber-950/10',
        };
      case 'SPEECH':
        return {
          badgeBg: 'bg-sky-100 dark:bg-sky-950/80',
          badgeText: 'text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800',
          badgeLabel: 'KONUŞMA',
          cardBorder: 'border-sky-200/80 dark:border-sky-800/60',
          cardBg: 'bg-sky-50/30 dark:bg-sky-950/10',
        };
      case 'NORMAL':
      default:
        return {
          badgeBg: 'bg-slate-100 dark:bg-slate-800',
          badgeText: 'text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          badgeLabel: 'NORMAL',
          cardBorder: 'border-slate-200 dark:border-slate-800',
          cardBg: 'bg-white dark:bg-slate-900',
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                ANINDA SES AKIŞI
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Çevrenizde algılanan sesler anlık zaman damgasıyla burada görünür.
              </p>
            </div>
          </div>
        </div>

        {/* Clear action */}
        {events.length > 0 && (
          <button
            onClick={onClearEvents}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Akışı Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Akışı Temizle</span>
          </button>
        )}
      </div>

      {/* Filter Segmented Controls */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Ses filtresi">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/70'
          }`}
        >
          Tümü ({events.length})
        </button>
        <button
          onClick={() => setFilter('HIGH_PRIORITY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filter === 'HIGH_PRIORITY'
              ? 'bg-rose-600 text-white'
              : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100'
          }`}
        >
          🚨 Yüksek Öncelik ({events.filter((e) => e.category === 'HIGH_PRIORITY').length})
        </button>
        <button
          onClick={() => setFilter('IMPORTANT')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filter === 'IMPORTANT'
              ? 'bg-amber-600 text-white'
              : 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
          }`}
        >
          🔔 Önemli ({events.filter((e) => e.category === 'IMPORTANT').length})
        </button>
        <button
          onClick={() => setFilter('SPEECH')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            filter === 'SPEECH'
              ? 'bg-sky-600 text-white'
              : 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100'
          }`}
        >
          💬 Konuşma ({events.filter((e) => e.category === 'SPEECH').length})
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="mt-4 space-y-2.5 max-h-[440px] overflow-y-auto pr-1" role="feed" aria-live="polite">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm">Bu filtreye uygun ses olayı bulunamadı.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const styles = getCategoryStyles(event.category);
            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent?.(event)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${styles.cardBorder} ${styles.cardBg} hover:shadow-sm cursor-pointer`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl select-none mt-0.5 shrink-0" aria-hidden="true">
                    {event.icon}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {event.title}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${styles.badgeBg} ${styles.badgeText}`}
                        >
                          {styles.badgeLabel}
                        </span>

                        {/* Clear Demo indicator to maintain honesty */}
                        {event.isDemo && (
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            (Demo)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500">
                        {event.decibel && <span>{event.decibel} dB</span>}
                        <span>·</span>
                        <span className="font-semibold">{event.time}</span>
                      </div>
                    </div>

                    {event.detail && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                        {event.category === 'SPEECH' ? `"${event.detail}"` : event.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
