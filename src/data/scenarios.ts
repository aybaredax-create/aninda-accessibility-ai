import { SoundEvent, SoundPriority, SoundType } from '../types';

export interface SoundDefinition {
  type: SoundType;
  title: string;
  icon: string;
  category: SoundPriority;
  description: string;
  defaultDecibel: number;
}

export const SOUND_DEFINITIONS: SoundDefinition[] = [
  // YÜKSEK ÖNCELİK (High Priority)
  {
    type: 'siren',
    title: 'Siren Algılandı',
    icon: '🚨',
    category: 'HIGH_PRIORITY',
    description: 'Ambulans, itfaiye veya polis sireni yaklaştı.',
    defaultDecibel: 88,
  },
  {
    type: 'fire_alarm',
    title: 'Yangın Alarmı Algılandı',
    icon: '🔥',
    category: 'HIGH_PRIORITY',
    description: 'Bina yangın tahliye alarmı sinyali duyuldu.',
    defaultDecibel: 92,
  },
  {
    type: 'smoke_alarm',
    title: 'Duman Alarmı Algılandı',
    icon: '💨',
    category: 'HIGH_PRIORITY',
    description: 'Duman dedektöründen kesintisiz tiz uyarı sinyali.',
    defaultDecibel: 85,
  },
  {
    type: 'car_horn',
    title: 'Araç Kornası Çaldı',
    icon: '🚗',
    category: 'HIGH_PRIORITY',
    description: 'Yakın çevreden ani korna uyarısı geldi.',
    defaultDecibel: 84,
  },
  {
    type: 'glass_break',
    title: 'Cam Kırılması Algılandı',
    icon: '💥',
    category: 'HIGH_PRIORITY',
    description: 'Pencere veya bardak kırılma sesi tespit edildi.',
    defaultDecibel: 80,
  },
  {
    type: 'shout',
    title: 'Bağırma / Ani Çığlık',
    icon: '🗣️',
    category: 'HIGH_PRIORITY',
    description: 'Yakın mesafede ani yüksek sesli insan sesi.',
    defaultDecibel: 86,
  },

  // ÖNEMLİ (Important)
  {
    type: 'doorbell',
    title: 'Kapı Zili Çalıyor',
    icon: '🔔',
    category: 'IMPORTANT',
    description: 'Daire kapı zili aktif edildi.',
    defaultDecibel: 74,
  },
  {
    type: 'door_knock',
    title: 'Kapı Çalması Algılandı',
    icon: '🚪',
    category: 'IMPORTANT',
    description: 'Kapıya fiziksel vuruş sesleri tespit edildi.',
    defaultDecibel: 68,
  },
  {
    type: 'phone_ring',
    title: 'Telefon Zil Sesi',
    icon: '📱',
    category: 'IMPORTANT',
    description: 'Sabit hat veya cep telefonu zil sesi çalıyor.',
    defaultDecibel: 72,
  },
  {
    type: 'dog_bark',
    title: 'Köpek Havlaması',
    icon: '🐕',
    category: 'IMPORTANT',
    description: 'Yakın çevrede köpek havlama sesi duyuldu.',
    defaultDecibel: 76,
  },
  {
    type: 'baby_cry',
    title: 'Bebek Ağlaması',
    icon: '👶',
    category: 'IMPORTANT',
    description: 'Bebek ağlama ve huzursuzluk sesi algılandı.',
    defaultDecibel: 75,
  },
  {
    type: 'water_running',
    title: 'Açık Kalan Su Sesi',
    icon: '💧',
    category: 'IMPORTANT',
    description: 'Musluktan sürekli su akış sesi tespit edildi.',
    defaultDecibel: 62,
  },
  {
    type: 'appliance_beep',
    title: 'Cihaz Uyarı Sinyali',
    icon: '⚡',
    category: 'IMPORTANT',
    description: 'Buzdolabı kapağı, çamaşır makinesi veya mikrodalga bitti uyarısı.',
    defaultDecibel: 66,
  },

  // NORMAL
  {
    type: 'music',
    title: 'Müzik Sesi',
    icon: '🎵',
    category: 'NORMAL',
    description: 'Ritmik arka plan müziği çalıyor.',
    defaultDecibel: 58,
  },
  {
    type: 'tv_sound',
    title: 'Televizyon / Yayın Sesi',
    icon: '📺',
    category: 'NORMAL',
    description: 'Televizyon veya radyo yayını algılandı.',
    defaultDecibel: 60,
  },
  {
    type: 'ambient_noise',
    title: 'Normal Ortam Sesi',
    icon: '☕',
    category: 'NORMAL',
    description: 'Kafe, ofis veya sokak uğultusu.',
    defaultDecibel: 52,
  },
  {
    type: 'unknown_loud',
    title: 'Bilinmeyen Önemli Ses',
    icon: '⚠️',
    category: 'NORMAL',
    description: 'Belirgin desibel yükselişi olan tanımlanmamış ses.',
    defaultDecibel: 78,
  },
];

export interface ScenarioItem {
  id: string;
  triggerText: string;
  actionText: string;
  category: SoundPriority | 'SPEECH';
  icon: string;
  simulatedSound: SoundType;
  sampleTranscript?: string;
}

export const DAILY_SCENARIOS: ScenarioItem[] = [
  {
    id: 'sc-friends',
    triggerText: 'Arkadaşların konuşuyor.',
    actionText: 'Telefon konuşmayı anında canlı yazıya dönüştürüyor.',
    category: 'SPEECH',
    icon: '💬',
    simulatedSound: 'speech',
    sampleTranscript: 'Merhaba! Saat üçte üniversite kütüphanesinin önünde buluşuyoruz, sunum slaytlarını da getirdim.',
  },
  {
    id: 'sc-doorbell',
    triggerText: 'Kapı zili çalıyor.',
    actionText: 'Ekranda belirgin kapı zili bildirimi beliriyor.',
    category: 'IMPORTANT',
    icon: '🔔',
    simulatedSound: 'doorbell',
  },
  {
    id: 'sc-horn',
    triggerText: 'Arabalar korna çalıyor.',
    actionText: 'Ekranda dikkat çekici araç kornası uyarısı beliriyor.',
    category: 'HIGH_PRIORITY',
    icon: '🚗',
    simulatedSound: 'car_horn',
  },
  {
    id: 'sc-doctor',
    triggerText: 'Doktor konuşuyor.',
    actionText: 'Muayene esnasındaki tüm yönlendirmeler canlı altyazıya dönüşüyor.',
    category: 'SPEECH',
    icon: '🩺',
    simulatedSound: 'speech',
    sampleTranscript: 'İlaçlarınızı her sabah tok karnına almanız gerekiyor. Haftaya çarşamba günü kontrol için tekrar görüşelim.',
  },
  {
    id: 'sc-fire',
    triggerText: 'Yangın alarmı çalıyor.',
    actionText: 'Yüksek öncelikli kırmızı görsel uyarı ekranı kaplıyor.',
    category: 'HIGH_PRIORITY',
    icon: '🔥',
    simulatedSound: 'fire_alarm',
  },
  {
    id: 'sc-phone',
    triggerText: 'Telefonun çalıyor.',
    actionText: 'Gelen çağrı zil sesi titreşim ve görsel ikonla bildiriliyor.',
    category: 'IMPORTANT',
    icon: '📱',
    simulatedSound: 'phone_ring',
  },
];

export const INITIAL_TIMELINE_EVENTS: SoundEvent[] = [
  {
    id: 'evt-1',
    time: '14:32',
    fullDate: new Date(Date.now() - 8 * 60000),
    type: 'speech',
    category: 'SPEECH',
    title: 'Konuşma Algılandı',
    icon: '💬',
    detail: 'Bugün saat üçte kütüphanede buluşalım.',
    isDemo: true,
    decibel: 64,
  },
  {
    id: 'evt-2',
    time: '14:34',
    fullDate: new Date(Date.now() - 6 * 60000),
    type: 'doorbell',
    category: 'IMPORTANT',
    title: 'Kapı Zili Algılandı',
    icon: '🔔',
    detail: 'Daire zili çalındı',
    isDemo: true,
    decibel: 74,
  },
  {
    id: 'evt-3',
    time: '14:36',
    fullDate: new Date(Date.now() - 4 * 60000),
    type: 'dog_bark',
    category: 'IMPORTANT',
    title: 'Köpek Havlaması Algılandı',
    icon: '🐕',
    detail: 'Yakında köpek havlama sesi',
    isDemo: true,
    decibel: 76,
  },
  {
    id: 'evt-4',
    time: '14:38',
    fullDate: new Date(Date.now() - 2 * 60000),
    type: 'music',
    category: 'NORMAL',
    title: 'Müzik Algılandı',
    icon: '🎵',
    detail: 'Arka planda melodik sesler',
    isDemo: true,
    decibel: 58,
  },
  {
    id: 'evt-5',
    time: '14:40',
    fullDate: new Date(Date.now() - 10000),
    type: 'siren',
    category: 'HIGH_PRIORITY',
    title: 'Siren Algılandı',
    icon: '🚨',
    detail: 'Acil durum aracı sinyali',
    isDemo: true,
    decibel: 88,
  },
];
