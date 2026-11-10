import React from 'react';
import { HeartHandshake, GraduationCap, ShieldCheck, Accessibility } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Core Social Purpose Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-bold tracking-widest uppercase text-teal-400">
              SOSYAL FAYDA & İNSAN MERKEZLİ TASARIM
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              “Çevremde ne olduğunu biliyorum.”
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              İşitme kaybı yaşayan bireyler için çevresel sesler ve konuşmalar günlük yaşamda temel bilgi kaynaklarıdır. Kapı zili, alarm, siren, telefon, araç kornası, bebek ağlaması veya bir kişinin konuşması gibi akustik ipuçlarının görsel olarak fark edilmesi güvenlik, iletişim ve sosyal katılım açısından vazgeçilmez bir özgürlüktür.
            </p>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              ANINDA, kullanıcıyı bağımsız, güçlü ve karar verici bir birey olarak merkeze alır; çevresel sesleri görselleştiren dijital bir işitsel farkındalık arkadaşı sunar.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Academic Project & Prototype Limits 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Info */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Akademik Proje Bilgisi
              </h3>
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Yapay Zekâ Destekli İşitsel Farkındalık ve Erişilebilir İletişim
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ANINDA, erişilebilirlik, yapay zekâ ve insan merkezli tasarım yaklaşımıyla geliştirilmiş deneysel bir üniversite sosyal fayda projesidir.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <strong>Projenin Amacı:</strong> İşitme kaybı yaşayan bireylerin günlük yaşamda önemli olan konuşma ve çevresel ses bilgilerine görsel yollarla erişebilmesini desteklemek.
            </div>
          </div>

          {/* Prototype Limits & WCAG */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Prototip Sınırları & Uyarı
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              “ANINDA, işitme kaybı yaşayan bireylerin çevresel seslere ve konuşmalara erişimini desteklemek amacıyla geliştirilmiş yapay zekâ destekli bir erişilebilirlik prototipidir. Uygulama tıbbi cihaz değildir ve profesyonel işitme cihazlarının, insan değerlendirmesinin veya resmi acil durum sistemlerinin yerine geçmez.”
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Accessibility className="w-4 h-4 text-teal-600" />
              <span>WCAG 2.1 AA erişilebilirlik prensipleri ve yüksek kontrast ilkeleriyle geliştirilmiştir.</span>
            </div>
          </div>
        </div>

        {/* Clean Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ANINDA — Telefonunuz sizin kulağınız. Erişilebilirlik Prototipi.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Web Audio API</span>
            <span aria-hidden="true">·</span>
            <span>Web Speech API</span>
            <span aria-hidden="true">·</span>
            <span>Gemini AI Entegrasyonu</span>
          </div>
        </footer>
      </div>
    </section>
  );
};
