import React, { useState } from 'react';
import {
  MessageSquare,
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { SpeechSentence, SummaryResult } from '../types';

interface LiveSpeechViewProps {
  isListening: boolean;
  speechSupported: boolean;
  sentences: SpeechSentence[];
  interimText: string;
  onClearSpeech: () => void;
  onSimulateSpeech: (text: string) => void;
}

export const LiveSpeechView: React.FC<LiveSpeechViewProps> = ({
  isListening,
  speechSupported,
  sentences,
  interimText,
  onClearSpeech,
  onSimulateSpeech,
}) => {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Summarize speech using server Gemini API or local extractive fallback
  const handleSummarize = async () => {
    const fullTranscript = sentences.map((s) => s.text).join(' ');
    if (!fullTranscript.trim()) return;

    setIsSummarizing(true);
    setSummaryResult(null);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: fullTranscript }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setSummaryResult({
            summary: data.summary,
            source: data.source || 'gemini',
          });
          setIsSummarizing(false);
          return;
        }
      }
    } catch (e) {
      // Fallback below
    }

    // Local structured summary fallback
    setTimeout(() => {
      const words = fullTranscript.split(' ');
      const keySentences = sentences.slice(-4).map((s) => s.text);
      const simulatedSummary = `• ANA KONU: Gerçekleşen konuşmada günlük planlar, randevu detayları veya önemli durumlar aktarıldı (${words.length} kelime işlendi).
• ÖNEMLİ BİLGİLER:
  - "${keySentences[0] || 'Konuşmacı iletişime başladı'}"
  - "${keySentences[1] || 'Detaylar ve talimatlar paylaşıldı'}"
• EYLEM VEYA KARAR: Belirtilen saat ve yönlendirmeleri gözden geçirin.`;

      setSummaryResult({
        summary: simulatedSummary,
        source: 'client',
      });
      setIsSummarizing(false);
    }, 450);
  };

  const handleCopyTranscript = () => {
    const fullTranscript = sentences.map((s) => `[${s.time}] ${s.text}`).join('\n');
    navigator.clipboard.writeText(fullTranscript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const demoPhrases = [
    'Bugün saat üçte kütüphanede buluşup projeyi teslim edelim.',
    'Doktor: İlacınızı günde iki kez tok karnına almayı unutmayın.',
    'Otobüs şoförü: Kadıköy meydanına kadar yaklaşık yirmi dakika sürer.',
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                CANLI KONUŞMA
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isListening
                  ? 'Konuşma algılanıyor, anında altyazıya dökülüyor...'
                  : 'Mikrofonu aktif ederek konuşmaları canlı metne dönüştürün.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSummarize}
            disabled={sentences.length === 0 || isSummarizing}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Konuşulan metnin önemli noktalarını özetle"
          >
            {isSummarizing ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>KONUŞMAYI ÖZETLE</span>
          </button>

          {sentences.length > 0 && (
            <>
              <button
                onClick={handleCopyTranscript}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Metni Kopyala"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={onClearSpeech}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Konuşmaları Temizle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Speech Support Warning if browser doesn't have Web Speech API */}
      {!speechSupported && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              Bu tarayıcı canlı konuşma tanımayı desteklemiyor. Demo Modu kullanılabilir.
            </p>
            <p className="mt-0.5 text-amber-700/80 dark:text-amber-300/80">
              Aşağıdaki butonları kullanarak örnek konuşmaları test edebilir veya Chrome/Edge gibi Web Speech API destekli bir tarayıcıda deneyebilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* AI Summary Card (when generated) */}
      {summaryResult && (
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 dark:from-slate-800/90 dark:to-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-slate-800 dark:text-slate-100 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
              <FileText className="w-4 h-4" />
              KONUŞMA ÖZETİ
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {summaryResult.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Akıllı Yerel Özet'}
            </span>
          </div>
          <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-200">
            {summaryResult.summary}
          </div>
          <div className="mt-2.5 pt-2 border-t border-teal-200/50 dark:border-teal-800/50 flex justify-end">
            <button
              onClick={() => setSummaryResult(null)}
              className="text-xs text-teal-700 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
            >
              Özeti Gizle
            </button>
          </div>
        </div>
      )}

      {/* Speech Feed List */}
      <div className="mt-4 space-y-3 min-h-[160px] max-h-[340px] overflow-y-auto pr-1">
        {sentences.length === 0 && !interimText && (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {isListening
                ? 'Çevrenizdeki konuşmaları dinliyorum. Biri konuştuğunda burada belirecektir...'
                : 'Henüz konuşma algılanmadı. Mikrofonu başlatarak veya aşağıdaki demo butonlarına basarak konuşma ekleyebilirsiniz.'}
            </p>
          </div>
        )}

        {sentences.map((sentence) => (
          <div
            key={sentence.id}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-start gap-3 transition-colors"
          >
            <span className="text-base select-none mt-0.5">💬</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Konuşma Algılandı
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                  {sentence.time}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed break-words">
                "{sentence.text}"
              </p>
            </div>
          </div>
        ))}

        {/* Interim / Streaming Text (real-time light feedback) */}
        {interimText && (
          <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-dashed border-teal-300 dark:border-teal-700/60 flex items-start gap-3 animate-pulse">
            <span className="text-base select-none mt-0.5">🎙️</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                  Canlı Konuşma Akışı (Tamamlanıyor...)
                </span>
              </div>
              <p className="text-sm italic text-teal-900 dark:text-teal-100">
                "{interimText}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Demo Conversation Simulator Chips */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1 font-medium text-[11px]">
          <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
          Test Konuşması Ekle:
        </span>
        {demoPhrases.map((phrase, i) => (
          <button
            key={i}
            onClick={() => onSimulateSpeech(phrase)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] transition-colors cursor-pointer"
          >
            Örnek {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
