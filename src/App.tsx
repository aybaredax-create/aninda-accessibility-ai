/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Sun,
  Moon,
  Type,
  Vibrate,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import {
  SoundEvent,
  MicStatus,
  SpeechSentence,
  SoundPriority,
} from './types';
import {
  audioService,
  AudioMetrics,
} from './services/audioService';
import { speechService } from './services/speechService';
import {
  SOUND_DEFINITIONS,
  SoundDefinition,
} from './data/scenarios';
import { ConversationChat, ChatMessage } from './components/ConversationChat';

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'init-1',
    time: '14:32',
    sender: 'other',
    text: 'Merhaba, nasılsın?',
  },
  {
    id: 'init-2',
    time: '14:33',
    sender: 'sound',
    icon: '🔔',
    text: 'Kapı zili algılandı',
  },
  {
    id: 'init-3',
    time: '14:35',
    sender: 'other',
    text: 'Arkadaşın: Bugün nereye gidelim?',
  },
  {
    id: 'init-4',
    time: '14:37',
    sender: 'sound',
    icon: '🚨',
    text: 'Siren algılandı',
    isHighPriority: true,
  },
];

export default function App() {
  // Theme & Accessibility
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Core App & Microphone Status
  const [micStatus, setMicStatus] = useState<MicStatus>('ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Detected Sound Focus
  const [activeSound, setActiveSound] = useState<SoundEvent | null>(null);
  const [liveSpeechText, setLiveSpeechText] = useState<string>('');
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  // Chat & Text-to-Speech State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync dark theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Haptic feedback trigger
  const triggerHaptic = useCallback(
    (pattern: number | number[]) => {
      if (!hapticEnabled) return;
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch (e) {}
      }
    },
    [hapticEnabled]
  );

  const getCurrentTimeStr = () => {
    return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  // Add Sound Event and append to chat history
  const displaySound = useCallback(
    (sound: Omit<SoundEvent, 'id' | 'time' | 'fullDate'>) => {
      const now = new Date();
      const timeStr = getCurrentTimeStr();
      const newEvent: SoundEvent = {
        ...sound,
        id: `evt-${Date.now()}`,
        time: timeStr,
        fullDate: now,
      };

      setActiveSound(newEvent);

      // Append sound to conversation history
      setChatMessages((prev) => [
        ...prev,
        {
          id: `chat-snd-${Date.now()}`,
          time: timeStr,
          sender: sound.category === 'SPEECH' ? 'other' : 'sound',
          text: sound.category === 'SPEECH' ? sound.detail || sound.title : `${sound.title}`,
          icon: sound.icon,
          isHighPriority: sound.category === 'HIGH_PRIORITY',
        },
      ]);

      if (newEvent.category === 'HIGH_PRIORITY') {
        triggerHaptic([300, 100, 300, 100, 500]);
      } else {
        triggerHaptic(120);
      }
    },
    [triggerHaptic]
  );

  // Text-to-Speech: Read out text aloud for the user to communicate with others
  const handleSpeakText = (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    const timeStr = getCurrentTimeStr();

    // 1. Add to chat history as user's voiced message
    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat-me-${Date.now()}`,
        time: timeStr,
        sender: 'me',
        text: clean,
      },
    ]);

    // 2. Speak aloud with Web Speech API SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'tr-TR';
        utterance.rate = 0.95;

        // Try to pick a Turkish voice if available
        const voices = window.speechSynthesis.getVoices();
        const trVoice = voices.find((v) => v.lang.toLowerCase().includes('tr'));
        if (trVoice) {
          utterance.voice = trVoice;
        }

        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
        setIsSpeaking(false);
      }
    }
  };

  // Start Listening
  const handleStartListening = async () => {
    setErrorMessage(null);

    const audioResult = await audioService.requestMicrophone(
      () => {},
      (peakDb) => {
        displaySound({
          type: 'unknown_loud',
          category: 'IMPORTANT',
          title: 'YÜKSEK SES ALGILANDI',
          icon: '⚠️',
          proximity: 'Yakın çevrenizde',
          detail: 'Belirgin ses yükselişi tespit edildi.',
          isDemo: false,
          decibel: peakDb,
        });
      }
    );

    if (!audioResult.success) {
      setMicStatus('denied');
      setErrorMessage(audioResult.error || 'Mikrofon başlatılamadı.');
      return;
    }

    setMicStatus('active');

    // Start Web Speech API if supported
    if (speechService.isSupported()) {
      speechService.start(
        (interim) => {
          setLiveSpeechText(interim);
          if (interim) {
            setActiveSound({
              id: `interim-${Date.now()}`,
              time: getCurrentTimeStr(),
              fullDate: new Date(),
              type: 'speech',
              category: 'SPEECH',
              title: 'KONUŞMA ALGILANDI',
              icon: '💬',
              proximity: 'Yakın çevrenizde',
              detail: interim,
              isDemo: false,
            });
          }
        },
        (final) => {
          setLiveSpeechText(final);
          displaySound({
            type: 'speech',
            category: 'SPEECH',
            title: 'KONUŞMA ALGILANDI',
            icon: '💬',
            proximity: 'Yakın çevrenizde',
            detail: final,
            isDemo: false,
          });
        },
        () => {}
      );
    }
  };

  // Stop Listening
  const handleStopListening = () => {
    audioService.stop();
    speechService.stop();
    setMicStatus('stopped');
    setLiveSpeechText('');
  };

  // Trigger Demo Sound
  const handleTriggerDemo = (soundDef: SoundDefinition) => {
    displaySound({
      type: soundDef.type,
      category: soundDef.category,
      title: soundDef.title,
      icon: soundDef.icon,
      proximity: soundDef.proximity,
      detail: soundDef.description,
      isDemo: true,
      decibel: soundDef.defaultDecibel,
    });
  };

  // Demo speech trigger
  const handleDemoSpeech = () => {
    const sample = 'Arkadaşın: Bugün saat 8’de buluşalım.';
    setLiveSpeechText(sample);
    displaySound({
      type: 'speech',
      category: 'SPEECH',
      title: 'KONUŞMA ALGILANDI',
      icon: '💬',
      proximity: 'Yakın çevrenizde',
      detail: sample,
      isDemo: true,
    });
  };

  const isListening = micStatus === 'active';

  return (
    <div
      className={`min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between ${
        isLargeFont ? 'text-lg' : 'text-base'
      }`}
    >
      {/* Ultra-Minimal Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
          <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900 dark:text-white">
            ANINDA
          </span>
        </div>

        {/* Quiet Accessibility & Theme Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            title={hapticEnabled ? 'Titreşim açık' : 'Titreşim kapalı'}
            aria-label="Titreşim bildirimi geçişi"
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              hapticEnabled
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            <Vibrate className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLargeFont(!isLargeFont)}
            title={isLargeFont ? 'Normal yazı' : 'Büyük yazı'}
            aria-label="Yazı boyutu değiştir"
            className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            <Type className="w-4 h-4 mr-0.5" />
            <span>{isLargeFont ? 'A+' : 'A'}</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Açık mod' : 'Koyu mod'}
            aria-label="Tema değiştir"
            className="min-h-[44px] min-w-[44px] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 max-w-xl mx-auto w-full">
        {/* Error message banner if permission denied */}
        {errorMessage && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Mikrofon İzni Gerekli</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              <p className="mt-1 text-xs opacity-75">
                Tarayıcı adres çubuğundaki kilit simgesine dokunarak mikrofon izni verebilirsiniz.
              </p>
            </div>
          </div>
        )}

        {!isListening ? (
          /* ========================================================= */
          /* 1. IDLE / ANA EKRAN: Radically minimal, singular focus     */
          /* ========================================================= */
          <div className="text-center w-full my-auto py-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              ANINDA
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400 tracking-tight">
              “Telefonunuz sizin kulağınız.”
            </p>

            {/* Singular Big Action Button */}
            <div className="mt-8 sm:mt-10 flex flex-col items-center">
              <button
                onClick={handleStartListening}
                className="w-full sm:w-80 py-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
                aria-label="ANINDA dinleme modunu aktif et - Çevredeki sesleri ve konuşmaları dinlemeye başla"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-300 animate-ping" />
                <Mic className="w-6 h-6" />
                <span>ANINDA AKTİF ET</span>
              </button>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Mikrofon izni yalnızca siz başlattığınızda istenir.
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* 2. AKTİF DİNLEME MODU: Displays ONLY detected sound       */
          /* ========================================================= */
          <div className="w-full my-auto py-4 flex flex-col items-center">
            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                ANINDA AKTİF · Çevrenizi dinliyorum
              </span>
            </div>

            {/* Singular Focal Alert Card */}
            <div
              className={`w-full rounded-3xl p-6 sm:p-8 text-center transition-all border ${
                activeSound?.category === 'HIGH_PRIORITY'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-white shadow-xl ring-4 ring-rose-500/20'
                  : activeSound?.category === 'IMPORTANT'
                  ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/80 text-amber-950 dark:text-white shadow-md'
                  : activeSound?.category === 'SPEECH'
                  ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-300/80 dark:border-sky-800/80 text-slate-900 dark:text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {activeSound ? (
                <div>
                  {/* Big Sound Icon */}
                  <div className="text-6xl sm:text-7xl mb-3 select-none" aria-hidden="true">
                    {activeSound.icon}
                  </div>

                  {/* High Priority Badge if applicable */}
                  {activeSound.category === 'HIGH_PRIORITY' && (
                    <span className="inline-block px-3 py-1 mb-2 text-xs font-black tracking-widest uppercase bg-rose-600 text-white rounded-md">
                      YÜKSEK ÖNCELİK
                    </span>
                  )}

                  {/* Large Sound Title */}
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight uppercase">
                    {activeSound.title}
                  </h2>

                  {/* Proximity text (Yakın çevrenizde / Çevrenizde) */}
                  {activeSound.proximity && (
                    <p className="mt-1 text-sm font-semibold opacity-80">
                      {activeSound.proximity}
                    </p>
                  )}

                  {/* Spoken text or detail */}
                  {activeSound.detail && (
                    <div className="mt-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800/60">
                      <p className="text-base sm:text-lg font-bold leading-relaxed break-words">
                        “{activeSound.detail}”
                      </p>
                    </div>
                  )}

                  <span className="block mt-3 text-xs font-mono opacity-50">
                    {activeSound.time}
                  </span>
                </div>
              ) : (
                /* Calm Waiting Pulse */
                <div className="py-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 animate-pulse">
                    <Mic className="w-7 h-7" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                    Çevredeki sesler bekleniyor...
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Sessiz ortam · Biri konuştuğunda veya önemli bir ses duyulduğunda ekranda belirecektir
                  </p>
                </div>
              )}
            </div>

            {/* Stop Action Button */}
            <div className="mt-6 w-full flex flex-col items-center">
              <button
                onClick={handleStopListening}
                className="w-full sm:w-80 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base sm:text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                aria-label="Dinlemeyi durdur - Mikrofon erişimini ve dinleme modunu kapat"
              >
                <MicOff className="w-5 h-5" />
                <span>DİNLENMEYİ DURDUR</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SOHBET GEÇMİŞİ & YAZILANI SESLENDİRME (Yeni 2 Özellik)     */}
        {/* ========================================================= */}
        <ConversationChat
          messages={chatMessages}
          onSendMessage={handleSpeakText}
          isSpeaking={isSpeaking}
        />

        {/* ========================================================= */}
        {/* QUICK DEMO TESTER (Discrete drawer for testing sounds)    */}
        {/* ========================================================= */}
        <div className="w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-900">
          <button
            onClick={() => setShowDemoDrawer(!showDemoDrawer)}
            className="w-full py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Örnek Sesleri Test Et (Demo)</span>
            {showDemoDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDemoDrawer && (
            <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <button
                  onClick={handleDemoSpeech}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors cursor-pointer"
                >
                  💬 Konuşma
                </button>
                {SOUND_DEFINITIONS.slice(0, 7).map((s) => (
                  <button
                    key={s.type}
                    onClick={() => handleTriggerDemo(s)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors cursor-pointer"
                  >
                    {s.icon} {s.title.replace(' ALGILANDI', '').replace(' ÇALIYOR', '')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. ÇOK AZ BİLGİLENDİRME (Radically simplified info area)   */}
      {/* ========================================================= */}
      <footer className="w-full border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/60 px-6 py-6">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1.5">
            ANINDA NASIL ÇALIŞIR?
          </h3>

          <div className="py-1.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
            <span>SES</span>
            <span className="text-teal-500">→</span>
            <span>MİKROFON</span>
            <span className="text-teal-500">→</span>
            <span>YAPAY ZEKÂ</span>
            <span className="text-teal-500">→</span>
            <span>GÖRSEL BİLGİ</span>
          </div>

          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            ANINDA, çevrenizdeki konuşmaları ve önemli çevresel sesleri algılayarak bunları sizin için görsel ve yazılı bilgilere dönüştürmeyi amaçlayan yapay zekâ destekli bir erişilebilirlik prototipidir.
          </p>

          {/* Simple daily life examples (no card clutter) */}
          <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-left text-xs text-slate-600 dark:text-slate-400 space-y-1.5 max-w-md mx-auto">
            <p className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Arkadaşlarınız konuşuyor</strong> → konuşmayı metne dönüştürür.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Kapı zili çalıyor</strong> → kapı zili bildirimi gösterir.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Siren duyuluyor</strong> → yüksek öncelikli uyarı gösterir.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Köpek havlıyor</strong> → köpek havlaması bildirimi gösterir.</span>
            </p>
          </div>

          {/* Academic identity & safety disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 space-y-0.5">
            <p>Yapay zekâ destekli işitsel farkındalık ve erişilebilir iletişim prototipi.</p>
            <p>Uygulama tıbbi cihaz veya resmi 112 acil durum sistemlerinin yerine geçmez.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
