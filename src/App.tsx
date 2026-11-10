/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  AlertTriangle,
  Sparkles,
  Volume2,
  Clock,
  Layers,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

import {
  SoundEvent,
  UIState,
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
  INITIAL_TIMELINE_EVENTS,
  DAILY_SCENARIOS,
  ScenarioItem,
} from './data/scenarios';

import { TopBar } from './components/TopBar';
import { AudioWaveform } from './components/AudioWaveform';
import { NeedSearchInput } from './components/NeedSearchInput';
import { LiveSpeechView } from './components/LiveSpeechView';
import { SoundTimeline } from './components/SoundTimeline';
import { DemoSoundBoard } from './components/DemoSoundBoard';
import { HighPriorityAlert } from './components/HighPriorityAlert';
import { ScenariosSection } from './components/ScenariosSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';

export default function App() {
  // Theme & Accessibility States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Core App States
  const [uiState, setUiState] = useState<UIState>('READY');
  const [micStatus, setMicStatus] = useState<MicStatus>('ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Metrics State
  const [audioMetrics, setAudioMetrics] = useState<AudioMetrics>({
    volumePercent: 0,
    decibel: 35,
    frequencyData: new Uint8Array(128),
  });

  // Speech Recognition States
  const [speechSupported, setSpeechSupported] = useState(true);
  const [interimSpeech, setInterimSpeech] = useState<string>('');
  const [speechList, setSpeechList] = useState<SpeechSentence[]>([]);

  // Sound Timeline & Latest Event
  const [timelineEvents, setTimelineEvents] = useState<SoundEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [latestSound, setLatestSound] = useState<SoundEvent | null>(INITIAL_TIMELINE_EVENTS[0] || null);
  const [activeHighPriorityAlert, setActiveHighPriorityAlert] = useState<SoundEvent | null>(null);

  // Active view tab in listening mode: 'timeline' | 'speech' | 'demo'
  const [activeTab, setActiveTab] = useState<'timeline' | 'speech' | 'demo'>('timeline');

  // Sync dark mode class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check speech recognition capability on mount
  useEffect(() => {
    setSpeechSupported(speechService.isSupported());
  }, []);

  // Trigger haptic vibration if supported and enabled
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

  // Format current time HH:MM
  const getCurrentTimeStr = () => {
    const now = new Date();
    return now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  // Add event to timeline
  const addSoundEvent = useCallback(
    (event: Omit<SoundEvent, 'id' | 'time' | 'fullDate'>) => {
      const now = new Date();
      const timeStr = getCurrentTimeStr();
      const newEvent: SoundEvent = {
        ...event,
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        time: timeStr,
        fullDate: now,
      };

      setTimelineEvents((prev) => [newEvent, ...prev]);
      setLatestSound(newEvent);

      if (newEvent.category === 'HIGH_PRIORITY') {
        setUiState('HIGH_PRIORITY');
        setActiveHighPriorityAlert(newEvent);
        triggerHaptic([300, 100, 300, 100, 500]); // Strong urgent vibration pattern
      } else {
        setUiState('DETECTED');
        triggerHaptic(120); // Subtle awareness vibration
        // Return to LISTENING state after brief feedback
        setTimeout(() => {
          setUiState((current) => (current === 'DETECTED' ? 'LISTENING' : current));
        }, 2000);
      }
    },
    [triggerHaptic]
  );

  // Real Microphone Activation (ANINDA AKTİF ET)
  const handleStartListening = async () => {
    setErrorMessage(null);
    setUiState('PROCESSING');

    // 1. Start Web Audio API stream
    const audioResult = await audioService.requestMicrophone(
      (metrics) => {
        setAudioMetrics(metrics);
      },
      (peakDb) => {
        // Sudden loud peak detected via real microphone!
        addSoundEvent({
          type: 'unknown_loud',
          category: 'IMPORTANT',
          title: 'Yüksek Ses Seviyesi Algılandı',
          icon: '⚠️',
          detail: `Mikrofon ani ${peakDb} dB ses dalgalanması yakaladı.`,
          isDemo: false,
          decibel: peakDb,
        });
      }
    );

    if (!audioResult.success) {
      setMicStatus('denied');
      setUiState('ERROR');
      setErrorMessage(audioResult.error || 'Mikrofon başlatılamadı.');
      return;
    }

    setMicStatus('active');
    setUiState('LISTENING');

    // 2. Start Live Speech Recognition if supported
    if (speechService.isSupported()) {
      speechService.start(
        (interim) => {
          setInterimSpeech(interim);
        },
        (final) => {
          setInterimSpeech('');
          const timeStr = getCurrentTimeStr();
          const newSpeech: SpeechSentence = {
            id: `speech-${Date.now()}`,
            text: final,
            time: timeStr,
            isFinal: true,
          };
          setSpeechList((prev) => [...prev, newSpeech]);

          // Also record speech to main sound timeline
          addSoundEvent({
            type: 'speech',
            category: 'SPEECH',
            title: 'Konuşma Algılandı',
            icon: '💬',
            detail: final,
            isDemo: false,
            decibel: 65,
          });
        },
        (status, isErr) => {
          if (isErr) {
            console.warn('Speech warning:', status);
          }
        }
      );
    }
  };

  // Stop Listening
  const handleStopListening = () => {
    audioService.stop();
    speechService.stop();
    setMicStatus('stopped');
    setUiState('STOPPED');
    setInterimSpeech('');
    setAudioMetrics({
      volumePercent: 0,
      decibel: 30,
      frequencyData: new Uint8Array(128),
    });
  };

  // Trigger Demo Sound Event
  const handleTriggerDemoSound = (soundDef: SoundDefinition) => {
    addSoundEvent({
      type: soundDef.type,
      category: soundDef.category,
      title: soundDef.title,
      icon: soundDef.icon,
      detail: soundDef.description,
      isDemo: true,
      decibel: soundDef.defaultDecibel,
    });
  };

  // Trigger Daily Scenario
  const handleTriggerScenario = (scenario: ScenarioItem) => {
    if (scenario.simulatedSound === 'speech' && scenario.sampleTranscript) {
      const timeStr = getCurrentTimeStr();
      setSpeechList((prev) => [
        ...prev,
        {
          id: `sc-speech-${Date.now()}`,
          text: scenario.sampleTranscript!,
          time: timeStr,
          isFinal: true,
        },
      ]);
      addSoundEvent({
        type: 'speech',
        category: 'SPEECH',
        title: scenario.triggerText,
        icon: scenario.icon,
        detail: scenario.sampleTranscript,
        isDemo: true,
        decibel: 66,
      });
      setActiveTab('speech');
    } else {
      const matched = SOUND_DEFINITIONS.find((s) => s.type === scenario.simulatedSound);
      if (matched) {
        addSoundEvent({
          type: matched.type,
          category: matched.category,
          title: matched.title,
          icon: matched.icon,
          detail: scenario.actionText,
          isDemo: true,
          decibel: matched.defaultDecibel,
        });
      }
    }

    // Smooth scroll to active area
    const el = document.getElementById('active-area');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Route user natural language need
  const handleRouteNeed = (
    target: 'speech' | 'timeline' | 'alerts' | 'demo',
    explanation?: string
  ) => {
    if (target === 'speech') {
      setActiveTab('speech');
    } else if (target === 'demo') {
      setActiveTab('demo');
    } else {
      setActiveTab('timeline');
    }

    const el = document.getElementById('active-area');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSimulateSpeech = (text: string) => {
    const timeStr = getCurrentTimeStr();
    setSpeechList((prev) => [
      ...prev,
      {
        id: `sim-speech-${Date.now()}`,
        text,
        time: timeStr,
        isFinal: true,
      },
    ]);
    addSoundEvent({
      type: 'speech',
      category: 'SPEECH',
      title: 'Konuşma Algılandı (Demo)',
      icon: '💬',
      detail: text,
      isDemo: true,
      decibel: 65,
    });
  };

  const isListening = micStatus === 'active';

  return (
    <div
      className={`min-h-screen bg-[#FBFBFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors ${
        isLargeFont ? 'text-lg' : 'text-base'
      }`}
    >
      {/* High Priority Emergency Overlay Alert */}
      <HighPriorityAlert
        alert={activeHighPriorityAlert}
        onDismiss={() => setActiveHighPriorityAlert(null)}
      />

      {/* Top Bar (§2 Top Bar Contract) */}
      <TopBar
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        isLargeFont={isLargeFont}
        onToggleFontSize={() => setIsLargeFont(!isLargeFont)}
        hapticEnabled={hapticEnabled}
        onToggleHaptic={() => setHapticEnabled(!hapticEnabled)}
        onNavigate={(id) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* HERO SECTION: Singular, Powerful, Focused Experience */}
        <section id="hero" className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-none">
            ANINDA
          </h1>
          <p className="mt-3 text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400 tracking-tight">
            “Telefonunuz sizin kulağınız.”
          </p>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Çevrenizdeki konuşmaları ve önemli sesleri algılayın, anlamlandırın ve ekranda görün.
          </p>

          {/* Singular Primary CTA Button with Maximum Hierarchy */}
          <div className="mt-8 flex flex-col items-center justify-center">
            {isListening ? (
              <button
                onClick={handleStopListening}
                className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer ring-4 ring-rose-500/20"
                aria-label="Dinlemeyi durdur"
              >
                <span className="w-4 h-4 rounded-full bg-white animate-pulse" />
                <MicOff className="w-6 h-6" />
                <span>DİNLENMEYİ DURDUR</span>
              </button>
            ) : (
              <button
                onClick={handleStartListening}
                className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-teal-600/25 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer ring-4 ring-teal-500/20"
                aria-label="ANINDA dinleme modunu başlat"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-300 animate-ping" />
                <Mic className="w-6 h-6" />
                <span>ANINDA AKTİF ET</span>
              </button>
            )}

            {/* Microphone Status Indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              {micStatus === 'active' && (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Mikrofon aktif · Çevrenizi dinliyorum
                </span>
              )}
              {micStatus === 'ready' && (
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Mikrofon hazır
                </span>
              )}
              {micStatus === 'stopped' && (
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  Dinleme durduruldu
                </span>
              )}
              {micStatus === 'denied' && (
                <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Mikrofon erişimine izin verilmedi
                </span>
              )}
            </div>

            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              Mikrofon izni yalnızca siz başlattığınızda istenir.
            </p>
          </div>
        </section>

        {/* Microphone Error Banner (if permission denied) */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto my-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Erişim Hatası</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              <p className="mt-1 text-xs opacity-80">
                Mikrofon izni olmadan da aşağıdaki <strong>Demo Modu</strong> ile tüm sesleri ve özellikleri deneyebilirsiniz.
              </p>
            </div>
          </div>
        )}

        {/* Live Reactive Audio Waveform directly tied to Web Audio API */}
        <div className="max-w-3xl mx-auto mb-6">
          <AudioWaveform
            isListening={isListening}
            metrics={audioMetrics}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Natural Language Assistant Input ("Şu anda neye ihtiyacın var?") */}
        <NeedSearchInput onRouteNeed={handleRouteNeed} />

        {/* ACTIVE AREA: Real-time sound awareness radar */}
        <section id="active-area" className="mt-8 scroll-mt-20">
          {/* Active Listening Status Card */}
          {isListening && (
            <div className="mb-6 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-teal-500 animate-ping" />
                <div>
                  <h2 className="text-sm font-bold text-teal-950 dark:text-teal-200">
                    ANINDA AKTİF
                  </h2>
                  <p className="text-xs text-teal-700 dark:text-teal-300">
                    Çevrenizi dinliyorum. Konuşmalar ve sesler canlı olarak işleniyor.
                  </p>
                </div>
              </div>

              {latestSound && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-xs">
                  <span className="text-base">{latestSound.icon}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Son: {latestSound.title}
                  </span>
                  <span className="font-mono text-slate-400">({latestSound.time})</span>
                </div>
              )}
            </div>
          )}

          {/* High Priority Sound Highlight (Section 12: En son algılanan önemli ses üstte büyük gösterilmeli) */}
          {latestSound && latestSound.category === 'HIGH_PRIORITY' && (
            <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-800 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-4xl select-none" aria-hidden="true">
                  {latestSound.icon}
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    EN SON ALGILANAN ÖNEMLİ SES
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 dark:text-rose-100 leading-tight">
                    {latestSound.title.toUpperCase()}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-200 mt-1">
                    {latestSound.detail}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono tabular-nums text-lg font-bold text-rose-900 dark:text-rose-200">
                  {latestSound.time}
                </span>
              </div>
            </div>
          )}

          {/* Section Navigation Tabs for Ergonomic Switching */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>ANINDA SES AKIŞI ({timelineEvents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('speech')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'speech'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>CANLI KONUŞMA ({speechList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('demo')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'demo'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>SES SİMÜLASYONU & DEMO</span>
              </button>
            </div>
          </div>

          {/* Active View Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {activeTab === 'timeline' && (
                <SoundTimeline
                  events={timelineEvents}
                  onClearEvents={() => setTimelineEvents([])}
                  onSelectEvent={(evt) => {
                    if (evt.category === 'HIGH_PRIORITY') {
                      setActiveHighPriorityAlert(evt);
                    }
                  }}
                />
              )}

              {activeTab === 'speech' && (
                <LiveSpeechView
                  isListening={isListening}
                  speechSupported={speechSupported}
                  sentences={speechList}
                  interimText={interimSpeech}
                  onClearSpeech={() => setSpeechList([])}
                  onSimulateSpeech={handleSimulateSpeech}
                />
              )}

              {activeTab === 'demo' && (
                <DemoSoundBoard
                  onTriggerSound={handleTriggerDemoSound}
                  isListening={isListening}
                />
              )}
            </div>

            {/* Sidebar View for Multi-Column Balance on Desktop */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Status / Assistant Card */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Sistem Durumu
                  </span>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {getCurrentTimeStr()}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Arayüz Durumu</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {uiState === 'READY' && 'Dinlemeye Hazır'}
                      {uiState === 'LISTENING' && 'Çevreyi Dinliyor'}
                      {uiState === 'PROCESSING' && 'Ses Analiz Ediliyor'}
                      {uiState === 'DETECTED' && 'Ses Algılandı'}
                      {uiState === 'HIGH_PRIORITY' && 'Yüksek Öncelikli Ses!'}
                      {uiState === 'STOPPED' && 'Dinleme Durduruldu'}
                      {uiState === 'ERROR' && 'Bağlantı Hatası'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Canlı Mikrofon</span>
                    <span className="font-bold">
                      {isListening ? 'Aktif (Web Audio)' : 'Kapalı'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Konuşma Tanıma</span>
                    <span className="font-bold">
                      {speechSupported ? 'Destekleniyor (tr-TR)' : 'Demo Modu Aktif'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400">Titreşim Bildirimi</span>
                    <span className="font-bold">{hapticEnabled ? 'Açık' : 'Kapalı'}</span>
                  </div>
                </div>

                {/* Quick actions inside sidebar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      // Trigger emergency demo test
                      const siren = SOUND_DEFINITIONS.find((s) => s.type === 'siren');
                      if (siren) handleTriggerDemoSound(siren);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>🚨 Acil Durum Uyarısını Test Et</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      const doorbell = SOUND_DEFINITIONS.find((s) => s.type === 'doorbell');
                      if (doorbell) handleTriggerDemoSound(doorbell);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>🔔 Kapı Zili Algısını Test Et</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Academic Identity Box */}
              <div className="p-5 rounded-3xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200">
                <span className="font-extrabold block text-sm mb-1 text-teal-950 dark:text-teal-100">
                  Sosyal Fayda Prototipi
                </span>
                <p className="leading-relaxed text-teal-800 dark:text-teal-300">
                  Bu uygulama üniversite dersi kapsamında geliştirilen işitsel farkındalık sistemidir. Çevresel sesler renk, simge ve metinle anında fark edilebilir hale gelir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GÜNLÜK HAYAT SENARYOLARI (Section 13) */}
        <ScenariosSection onTriggerScenario={handleTriggerScenario} />

        {/* NASIL ÇALIŞIR? (Section 14) */}
        <HowItWorksSection />

        {/* SOSYAL FAYDA & HAKKINDA (Sections 15, 24, 25) */}
        <AboutSection />
      </main>
    </div>
  );
}
