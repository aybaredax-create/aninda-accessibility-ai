export type SoundPriority = 'NORMAL' | 'IMPORTANT' | 'HIGH_PRIORITY';

export type SoundType =
  | 'speech'
  | 'doorbell'
  | 'door_knock'
  | 'phone_ring'
  | 'alarm'
  | 'smoke_alarm'
  | 'fire_alarm'
  | 'siren'
  | 'car_horn'
  | 'dog_bark'
  | 'baby_cry'
  | 'glass_break'
  | 'water_running'
  | 'appliance_beep'
  | 'shout'
  | 'laughter'
  | 'music'
  | 'tv_sound'
  | 'ambient_noise'
  | 'unknown_loud';

export interface SoundEvent {
  id: string;
  time: string; // e.g. "14:32"
  fullDate: Date;
  type: SoundType;
  category: SoundPriority | 'SPEECH';
  title: string;
  icon: string;
  detail?: string;
  isDemo?: boolean;
  decibel?: number;
  acknowledged?: boolean;
}

export type UIState =
  | 'READY'
  | 'LISTENING'
  | 'PROCESSING'
  | 'DETECTED'
  | 'HIGH_PRIORITY'
  | 'ERROR'
  | 'STOPPED';

export type MicStatus = 'ready' | 'active' | 'denied' | 'stopped' | 'unsupported';

export interface SpeechSentence {
  id: string;
  text: string;
  time: string;
  isFinal: boolean;
  speakerTag?: string;
}

export interface SummaryResult {
  summary: string;
  source: 'gemini' | 'client';
}
