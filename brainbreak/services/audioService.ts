// Simple synth implementation using Web Audio API
class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Reduce volume
      this.masterGain.connect(this.ctx.destination);
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    // Envelope
    gain.gain.setValueAtTime(0, this.ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration + 0.1);
  }

  playClick() {
    this.playTone(600, 'sine', 0.1);
  }

  playSuccess() {
    this.init();
    // A major chord arpeggio
    this.playTone(440, 'sine', 0.3, 0); // A4
    this.playTone(554.37, 'sine', 0.3, 0.1); // C#5
    this.playTone(659.25, 'sine', 0.4, 0.2); // E5
    this.playTone(880, 'triangle', 0.6, 0.3); // A5
  }

  playStart() {
    this.init();
    // Swell effect
    this.playTone(300, 'sine', 0.4, 0);
    this.playTone(600, 'sine', 0.4, 0.1);
  }
}

export const audioService = new AudioService();