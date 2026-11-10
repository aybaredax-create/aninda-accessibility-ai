import React from 'react';
import { Mic, Cpu, Binary, Eye, Lock, ArrowDown } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'SES',
      desc: 'Çevrede konuşmalar, alarmlar, zil sesleri veya ani akustik dalgalar oluşur.',
      icon: <Binary className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      step: '02',
      title: 'TELEFON MİKROFONU',
      desc: 'Cihaz mikrofonu Web Audio API ile ses frekanslarını ve desibel seviyesini anlık yakalar.',
      icon: <Mic className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      step: '03',
      title: 'YAPAY ZEKA / SES TANIMA',
      desc: 'Konuşma tanıma ve akustik sınıflandırma algoritmaları sesin türünü ve metnini çözümler.',
      icon: <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      step: '04',
      title: 'SESİN ANLAMI',
      desc: 'Ses önceliklendirilir: Normal arka plan, günlük önemli ipucu veya yüksek öncelikli acil durum.',
      icon: <Binary className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      step: '05',
      title: 'EKRANDA GÖRSEL VE YAZILI BİLGİ',
      desc: 'Kullanıcı ekranında büyük simgeler, canlı konuşma altyazıları ve görsel uyarılar belirir.',
      icon: <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            MİMARİ VE ÇALIŞMA PRENSİBİ
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nasıl Çalışır?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            “ANINDA, mikrofon aracılığıyla çevredeki konuşma ve ses ipuçlarını algılayarak bunları kullanıcı için yazılı ve görsel bilgiye dönüştürmeyi amaçlayan yapay zekâ destekli bir erişilebilirlik prototipidir.”
          </p>
        </div>

        {/* Hero image visual banner */}
        <div className="mb-12 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 relative h-48 sm:h-64 shadow-sm">
          <img
            src="/src/assets/images/sound_awareness_hero_1794308407263.jpg"
            alt="Ses dalgalarının görsel ışık frekanslarına dönüşüm mimarisi"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end p-6">
            <p className="text-white text-xs sm:text-sm font-medium">
              Ses dalgalarından anlamlı görsel ve yazılı bilgiye: Uçtan uca işitsel farkındalık.
            </p>
          </div>
        </div>

        {/* 5-step Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="md:hidden mt-3 pt-2 flex justify-center text-slate-300 dark:text-slate-700">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Privacy & Device Security Card */}
        <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              Gizlilik ve Güvenlik Taahhüdü
            </h4>
            <p className="leading-relaxed">
              Mikrofon erişimi yalnızca siz “ANINDA AKTİF ET” butonuna bastığınızda talep edilir. Ses dalgaları doğrudan cihazınızın tarayıcısında Web Audio API ile işlenir ve gereksiz ses kaydı yapılmaz. Dinlemeyi durdurduğunuz anda tüm mikrofon kanalları tamamen kapatılır.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
