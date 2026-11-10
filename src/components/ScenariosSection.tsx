import React from 'react';
import { DAILY_SCENARIOS, ScenarioItem } from '../data/scenarios';
import { ArrowUpRight, Play } from 'lucide-react';

interface ScenariosSectionProps {
  onTriggerScenario: (scenario: ScenarioItem) => void;
}

export const ScenariosSection: React.FC<ScenariosSectionProps> = ({ onTriggerScenario }) => {
  return (
    <section id="scenarios" className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              GÜNLÜK HAYAT SENARYOLARI
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Her Durumda Çevrenizden Haberdar Olun
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              İşitme kaybı yaşayan bireyler için ses yalnızca bir duyum değil, güvende olma, iletişim kurma ve bağımsız hareket etme anahtarıdır. ANINDA günlük hayatta şu senaryolarda devreye girer:
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Kartlara tıklayarak senaryoları anında simüle edebilirsiniz.
          </div>
        </div>

        {/* 2-column or 3-column scenario grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DAILY_SCENARIOS.map((item) => {
            const isHighPriority = item.category === 'HIGH_PRIORITY';
            return (
              <div
                key={item.id}
                className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl select-none" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHighPriority
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                          : item.category === 'IMPORTANT'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300'
                      }`}
                    >
                      {item.category === 'HIGH_PRIORITY'
                        ? 'YÜKSEK ÖNCELİK'
                        : item.category === 'IMPORTANT'
                        ? 'ÖNEMLİ'
                        : 'KONUŞMA'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    “{item.triggerText}”
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.actionText}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Akustik İpucu
                  </span>
                  <button
                    onClick={() => onTriggerScenario(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Simüle Et</span>
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Photo Showcase */}
        <div className="mt-10 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 p-6 sm:p-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Sessiz Ama Farkında Bir Yaşam
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Görsel İpuçlarıyla Kesintisiz Odaklanma
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              İster evinizde kitap okurken, ister çalışma masanızda bir projeye odaklanırken kapı zilini, ocaktaki suyun taşmasını veya telefon zilini kaçırma endişesi taşımayın. ANINDA, telefon ekranınızı sakin ve güvenilir bir görsel radara dönüştürür.
            </p>
          </div>
          <div className="w-full lg:w-1/2 h-64 sm:h-80 relative overflow-hidden">
            <img
              src="/src/assets/images/daily_accessibility_scene_1794308408204.jpg"
              alt="Huzurlu ve modern yaşam alanında görsel erişilebilirlik kullanımı"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
