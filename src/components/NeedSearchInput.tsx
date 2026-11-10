import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

interface NeedSearchInputProps {
  onRouteNeed: (targetSection: 'speech' | 'timeline' | 'alerts' | 'demo', explanation?: string) => void;
}

export const NeedSearchInput: React.FC<NeedSearchInputProps> = ({ onRouteNeed }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sampleNeeds = [
    'Arkadaşlarım konuşuyor',
    'Kapı zilini kaçırıyorum',
    'Evde alarm çaldı',
    'Doktorun dediklerini kaçırıyorum',
    'Çevremdeki sesleri görmek istiyorum',
  ];

  const handleProcessNeed = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    setIsLoading(true);
    setFeedback(null);

    // First try backend API (/api/intent)
    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.targetSection) {
          setFeedback(data.explanation || 'İhtiyacınıza uygun bölüme yönlendiriliyorsunuz.');
          onRouteNeed(data.targetSection, data.explanation);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      // Fallback to local rule-based intent
    }

    // Local deterministic intent matching (instant, privacy-preserving)
    const lower = clean.toLowerCase();
    let target: 'speech' | 'timeline' | 'alerts' | 'demo' = 'timeline';
    let message = 'Tüm algılanan olayları zaman çizelgesinde takip edebilirsiniz.';

    if (
      lower.includes('arkadaş') ||
      lower.includes('konuş') ||
      lower.includes('doktor') ||
      lower.includes('öğretmen') ||
      lower.includes('takip edem') ||
      lower.includes('altyazı')
    ) {
      target = 'speech';
      message = 'Canlı konuşma altyazı ve konuşma özetleme bölümü öne çıkarıldı.';
    } else if (
      lower.includes('alarm') ||
      lower.includes('siren') ||
      lower.includes('yangın') ||
      lower.includes('acil') ||
      lower.includes('cam') ||
      lower.includes('korna')
    ) {
      target = 'alerts';
      message = 'Yüksek öncelikli acil durum uyarı ekranı öne çıkarıldı.';
    } else if (
      lower.includes('kapı') ||
      lower.includes('zil') ||
      lower.includes('köpek') ||
      lower.includes('bebek') ||
      lower.includes('su') ||
      lower.includes('cihaz')
    ) {
      target = 'demo';
      message = 'Çevresel ses simülasyon ve farkındalık paneli açıldı.';
    }

    setFeedback(message);
    onRouteNeed(target, message);
    setIsLoading(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessNeed(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-2">
      <form onSubmit={onSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Şu anda neye ihtiyacın var?"
            className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
            aria-label="Kullanıcı ihtiyacı arama kutusu"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Yönlendir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <Sparkles className="w-3 h-3 text-teal-500" /> Örnekler:
        </span>
        {sampleNeeds.map((need, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(need);
              handleProcessNeed(need);
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            {need}
          </button>
        ))}
      </div>

      {/* Assistant Feedback note */}
      {feedback && (
        <div className="mt-2.5 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-800 dark:text-teal-200 flex items-center justify-between">
          <span>{feedback}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-teal-600 dark:text-teal-400 hover:underline font-semibold ml-2 cursor-pointer"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  );
};
