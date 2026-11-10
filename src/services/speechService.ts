// Web Speech API interface definitions
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export type SpeechInterimCallback = (interimText: string) => void;
export type SpeechFinalCallback = (finalText: string) => void;
export type SpeechStatusCallback = (statusText: string, isError?: boolean) => void;

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private shouldRestart: boolean = false;
  private onInterim: SpeechInterimCallback | null = null;
  private onFinal: SpeechFinalCallback | null = null;
  private onStatus: SpeechStatusCallback | null = null;

  isSupported(): boolean {
    return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  start(
    onInterim: SpeechInterimCallback,
    onFinal: SpeechFinalCallback,
    onStatus: SpeechStatusCallback
  ): { success: boolean; message?: string } {
    this.onInterim = onInterim;
    this.onFinal = onFinal;
    this.onStatus = onStatus;

    if (!this.isSupported()) {
      return {
        success: false,
        message: 'Bu tarayıcı canlı konuşma tanımayı desteklemiyor. Demo Modu kullanılabilir.',
      };
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'tr-TR';
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStatus?.('Canlı konuşma dinleniyor...');
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const cleanFinal = transcript.trim();
            if (cleanFinal) {
              this.onFinal?.(cleanFinal);
            }
          } else {
            interimTranscript += transcript;
          }
        }
        this.onInterim?.(interimTranscript);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'no-speech') {
          // Expected when quiet, do not show fatal error
          return;
        }
        if (event.error === 'not-allowed') {
          this.onStatus?.('Mikrofon konuşma izni verilmedi.', true);
          this.shouldRestart = false;
          return;
        }
        if (event.error === 'network') {
          this.onStatus?.('Konuşma tanıma ağına bağlanılamadı. Yerel demo aktif.', true);
          return;
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // If user hasn't explicitly stopped, restart continuous speech recognition
        if (this.shouldRestart) {
          try {
            this.recognition?.start();
          } catch (e) {
            // Wait slightly before restarting
            setTimeout(() => {
              if (this.shouldRestart) {
                try {
                  this.recognition?.start();
                } catch (err) {}
              }
            }, 500);
          }
        }
      };

      this.shouldRestart = true;
      this.recognition.start();
      return { success: true };
    } catch (err: any) {
      console.warn('Failed to start SpeechRecognition:', err);
      return {
        success: false,
        message: 'Konuşma tanıma servisi başlatılamadı: ' + (err.message || 'Bilinmeyen hata'),
      };
    }
  }

  stop() {
    this.shouldRestart = false;
    this.isListening = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
      this.recognition = null;
    }
  }

  isActive(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
