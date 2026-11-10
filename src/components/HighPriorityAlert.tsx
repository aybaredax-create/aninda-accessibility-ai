import React from 'react';
import { AlertTriangle, X, ShieldAlert, Clock } from 'lucide-react';
import { SoundEvent } from '../types';

interface HighPriorityAlertProps {
  alert: SoundEvent | null;
  onDismiss: () => void;
}

export const HighPriorityAlert: React.FC<HighPriorityAlertProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-x-3 top-20 z-50 max-w-xl mx-auto animate-bounce-short"
    >
      <div className="bg-rose-600 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-white dark:border-slate-900 ring-4 ring-rose-500/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <span className="text-4xl select-none shrink-0" aria-hidden="true">
              {alert.icon}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-white text-rose-700">
                  ACİL DURUM UYARISI
                </span>
                <span className="flex items-center gap-1 text-xs opacity-90 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {alert.time}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                {alert.title.toUpperCase()}
              </h3>

              <p className="mt-1.5 text-sm sm:text-base font-medium opacity-95 leading-snug">
                {alert.detail || 'Çevrenizde yüksek riskli veya acil durum niteliğinde ses algılanmış olabilir.'}
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="min-h-[44px] min-w-[44px] p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Uyarıyı kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Safety Disclaimer as requested in specification */}
        <div className="mt-4 pt-3 border-t border-white/25 flex items-start gap-2 text-xs opacity-90">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Önemli Uyarı:</strong> Bu prototip bir akademik erişilebilirlik aracıdır, gerçek acil durum sistemlerinin yerine geçmez ve otomatik 112 acil çağrısı yapmaz. Çevrenizi fiziksel olarak kontrol edin.
          </p>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={onDismiss}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-rose-700 font-bold text-sm shadow hover:bg-rose-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            Fark Ettim / Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
