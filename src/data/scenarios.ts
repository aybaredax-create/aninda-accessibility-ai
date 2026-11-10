import { SoundEvent, SoundPriority, SoundType } from '../types';

export interface SoundDefinition {
  type: SoundType;
  title: string;
  icon: string;
  category: SoundPriority;
  description: string;
  defaultDecibel: number;
  proximity: string;
}

export const SOUND_DEFINITIONS: SoundDefinition[] = [
  // YÜKSEK ÖNCELİK (High Priority)
  {
    type: 'siren',
    title: 'SİREN ALGILANDI',
    icon: '🚨',
    category: 'HIGH_PRIORITY',
    description: 'Yüksek öncelikli acil durum sinyali',
    defaultDecibel: 88,
    proximity: 'Çevrenizde',
  },
  {
    type: 'fire_alarm',
    title: 'YANGIN ALARMI ALGILANDI',
    icon: '🔥',
    category: 'HIGH_PRIORITY',
    description: 'Tahliye veya yangın alarmı uyarısı',
    defaultDecibel: 92,
    proximity: 'Çevrenizde',
  },
  {
    type: 'smoke_alarm',
    title: 'DUMAN ALARMI ALGILANDI',
    icon: '💨',
    category: 'HIGH_PRIORITY',
    description: 'Duman dedektöründen kesintisiz tiz uyarı sinyali',
    defaultDecibel: 85,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'car_horn',
    title: 'ARAÇ KORNASI ALGILANDI',
    icon: '🚗',
    category: 'HIGH_PRIORITY',
    description: 'Trafik korna uyarısı',
    defaultDecibel: 84,
    proximity: 'Çevrenizde',
  },
  {
    type: 'glass_break',
    title: 'CAM KIRILMASI ALGILANDI',
    icon: '💥',
    category: 'HIGH_PRIORITY',
    description: 'Cam veya sert yüzey kırılma sesi',
    defaultDecibel: 80,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'shout',
    title: 'BAĞIRMA / ANİ SES ALGILANDI',
    icon: '🗣️',
    category: 'HIGH_PRIORITY',
    description: 'Yüksek desibel insan sesi',
    defaultDecibel: 86,
    proximity: 'Yakın çevrenizde',
  },

  // ÖNEMLİ (Important)
  {
    type: 'doorbell',
    title: 'KAPI ZİLİ ALGILANDI',
    icon: '🔔',
    category: 'IMPORTANT',
    description: 'Kapı zili çalıyor',
    defaultDecibel: 74,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'door_knock',
    title: 'KAPI ÇALMASI ALGILANDI',
    icon: '🚪',
    category: 'IMPORTANT',
    description: 'Kapıya vurulma sesi tespit edildi',
    defaultDecibel: 68,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'phone_ring',
    title: 'TELEFON ÇALIYOR',
    icon: '📱',
    category: 'IMPORTANT',
    description: 'Zil sesi duyuldu',
    defaultDecibel: 72,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'dog_bark',
    title: 'KÖPEK HAVLAMASI ALGILANDI',
    icon: '🐕',
    category: 'IMPORTANT',
    description: 'Köpek havlama sesi duyuldu',
    defaultDecibel: 76,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'baby_cry',
    title: 'BEBEK AĞLAMASI ALGILANDI',
    icon: '👶',
    category: 'IMPORTANT',
    description: 'Bebek ağlama sesi duyuldu',
    defaultDecibel: 75,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'water_running',
    title: 'SU AKMASI ALGILANDI',
    icon: '💧',
    category: 'IMPORTANT',
    description: 'Musluk veya su akış sesi',
    defaultDecibel: 62,
    proximity: 'Yakın çevrenizde',
  },
  {
    type: 'appliance_beep',
    title: 'CİHAZ UYARISI ALGILANDI',
    icon: '⚡',
    category: 'IMPORTANT',
    description: 'Elektronik cihaz bip uyarısı',
    defaultDecibel: 66,
    proximity: 'Yakın çevrenizde',
  },

  // NORMAL
  {
    type: 'music',
    title: 'MÜZİK ALGILANDI',
    icon: '🎵',
    category: 'NORMAL',
    description: 'Melodik sesler çalıyor',
    defaultDecibel: 58,
    proximity: 'Çevrenizde',
  },
  {
    type: 'tv_sound',
    title: 'TELEVİZYON SESİ',
    icon: '📺',
    category: 'NORMAL',
    description: 'Yayın veya ses kaydı algılandı',
    defaultDecibel: 60,
    proximity: 'Çevrenizde',
  },
  {
    type: 'ambient_noise',
    title: 'NORMAL ORTAM SESİ',
    icon: '☕',
    category: 'NORMAL',
    description: 'Arka plan hafif uğultusu',
    defaultDecibel: 52,
    proximity: 'Çevrenizde',
  },
  {
    type: 'unknown_loud',
    title: 'BİLİNMEYEN SES ALGILANDI',
    icon: '⚠️',
    category: 'NORMAL',
    description: 'Ani ses seviyesi artışı',
    defaultDecibel: 78,
    proximity: 'Çevrenizde',
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
