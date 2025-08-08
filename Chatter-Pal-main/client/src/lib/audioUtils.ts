export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  async initialize(stream: MediaStream): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.source = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      this.source.connect(this.analyser);
    } catch (error) {
      console.error('Error initializing audio analyzer:', error);
      throw error;
    }
  }

  getVolumeLevel(): number {
    if (!this.analyser || !this.dataArray) return 0;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    
    return sum / this.dataArray.length / 255; // Normalize to 0-1
  }

  getFrequencyData(): number[] {
    if (!this.analyser || !this.dataArray) return [];
    
    this.analyser.getByteFrequencyData(this.dataArray);
    return Array.from(this.dataArray).map(value => value / 255);
  }

  getWaveformData(): number[] {
    if (!this.analyser || !this.dataArray) return [];
    
    this.analyser.getByteTimeDomainData(this.dataArray);
    return Array.from(this.dataArray).map(value => (value - 128) / 128);
  }

  dispose(): void {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.dataArray = null;
  }
}

export class SpeechDetector {
  private volumeThreshold = 0.1;
  private silenceTimeout = 2000; // 2 seconds
  private silenceTimer: NodeJS.Timeout | null = null;
  private isSpeaking = false;
  private onSpeechStart?: () => void;
  private onSpeechEnd?: () => void;

  constructor(options?: {
    volumeThreshold?: number;
    silenceTimeout?: number;
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
  }) {
    if (options?.volumeThreshold) this.volumeThreshold = options.volumeThreshold;
    if (options?.silenceTimeout) this.silenceTimeout = options.silenceTimeout;
    this.onSpeechStart = options?.onSpeechStart;
    this.onSpeechEnd = options?.onSpeechEnd;
  }

  analyze(volumeLevel: number): void {
    const isSpeakingNow = volumeLevel > this.volumeThreshold;

    if (isSpeakingNow && !this.isSpeaking) {
      // Speech started
      this.isSpeaking = true;
      this.onSpeechStart?.();
      
      // Clear any pending silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    } else if (!isSpeakingNow && this.isSpeaking) {
      // Potential speech end - start silence timer
      if (!this.silenceTimer) {
        this.silenceTimer = setTimeout(() => {
          this.isSpeaking = false;
          this.onSpeechEnd?.();
          this.silenceTimer = null;
        }, this.silenceTimeout);
      }
    } else if (isSpeakingNow && this.isSpeaking && this.silenceTimer) {
      // Speech resumed before timeout
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  reset(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.isSpeaking = false;
  }
}

export function createAudioVisualizer(
  canvas: HTMLCanvasElement, 
  analyzer: AudioAnalyzer,
  type: 'waveform' | 'frequency' = 'waveform'
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  let animationFrame: number;
  
  const draw = () => {
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (type === 'waveform') {
      const waveformData = analyzer.getWaveformData();
      if (waveformData.length === 0) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const sliceWidth = width / waveformData.length;
      let x = 0;
      
      for (let i = 0; i < waveformData.length; i++) {
        const v = waveformData[i];
        const y = (v + 1) * height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.stroke();
    } else {
      const frequencyData = analyzer.getFrequencyData();
      if (frequencyData.length === 0) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }
      
      const barWidth = width / frequencyData.length;
      
      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = frequencyData[i] * height;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#3b82f6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
      }
    }
    
    animationFrame = requestAnimationFrame(draw);
  };
  
  draw();
  
  // Return cleanup function
  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
}
