export interface AudioMetrics {
  volumePercent: number; // 0 to 100
  decibel: number;       // approx 30 to 100 dB
  frequencyData: Uint8Array;
}

export type VolumeCallback = (metrics: AudioMetrics) => void;
export type PeakCallback = (decibel: number) => void;

class AudioService {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private lastPeakTime: number = 0;

  async requestMicrophone(
    onMetrics: VolumeCallback,
    onLoudPeak?: PeakCallback
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          success: false,
          error: 'Tarayıcınız mikrofon erişimini desteklemiyor.',
        };
      }

      // Request live microphone stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // keep ambient sounds audible
          autoGainControl: true,
        },
      });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        return {
          success: false,
          error: 'AudioContext tarayıcınızda desteklenmiyor.',
        };
      }

      this.audioContext = new AudioContextClass();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      this.isRunning = true;
      this.startMeterLoop(onMetrics, onLoudPeak);

      return { success: true };
    } catch (err: any) {
      console.warn('Microphone permission or hardware error:', err);
      let userFriendlyMessage = 'Mikrofon başlatılamadı.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userFriendlyMessage = 'Mikrofon erişimine izin verilmedi. Lütfen tarayıcı ayarlarından (adres çubuğundaki kilit simgesi) mikrofon izni verin.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userFriendlyMessage = 'Cihazda bağlı bir mikrofon bulunamadı.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        userFriendlyMessage = 'Mikrofon başka bir uygulama tarafından kullanılıyor olabilir.';
      }

      this.stop();
      return { success: false, error: userFriendlyMessage };
    }
  }

  private startMeterLoop(onMetrics: VolumeCallback, onLoudPeak?: PeakCallback) {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    const updateLoop = () => {
      if (!this.isRunning || !this.analyser) return;

      this.analyser.getByteTimeDomainData(timeData);
      this.analyser.getByteFrequencyData(freqData);

      // Compute RMS (Root Mean Square) for realistic volume
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (timeData[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);

      // Convert to normalized percentage 0 - 100 with dynamic non-linear curve
      const volumePercent = Math.min(100, Math.round(rms * 280));

      // Realistic decibel approximation (quiet room ~ 35dB, shouting/alarm ~ 90-100dB)
      const calculatedDb = Math.min(100, Math.max(30, Math.round(35 + rms * 110)));

      // Peak trigger check (e.g. sudden loud sound > 80dB with at least 3 sec debounce)
      const now = Date.now();
      if (calculatedDb >= 82 && now - this.lastPeakTime > 4000) {
        this.lastPeakTime = now;
        if (onLoudPeak) {
          onLoudPeak(calculatedDb);
        }
      }

      onMetrics({
        volumePercent,
        decibel: calculatedDb,
        frequencyData: freqData,
      });

      this.animationFrameId = requestAnimationFrame(updateLoop);
    };

    this.animationFrameId = requestAnimationFrame(updateLoop);
  }

  stop() {
    this.isRunning = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (e) {}
      this.sourceNode = null;
    }

    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch (e) {}
      this.analyser = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {}
      this.audioContext = null;
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export const audioService = new AudioService();
