// Web Audio API를 사용한 효과음 서비스
// 별도의 mp3 파일 없이 코드로 소리를 생성합니다.

class AudioService {
  private audioContext: AudioContext | null = null;

  constructor() {
    // 브라우저 호환성을 위한 초기화
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.audioContext = new AudioContextClass();
    }
  }

  private ensureContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            this.audioContext = new AudioContextClass();
        }
    }
  }

  // 1. 긍정적인 알림음 (경험 발굴 성공 시)
  playSuccess() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 도-미-솔 느낌의 화음 아르페지오
    const now = this.audioContext.currentTime;
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    oscillator.start(now);
    oscillator.stop(now + 0.4);
  }

  // 2. 가벼운 클릭음 (메시지 전송 등)
  playClick() {
    this.ensureContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  // 3. 페이지 전환음 (Shush 효과)
  playTransition() {
    this.ensureContext();
    if (!this.audioContext) return;
    
    // White noise buffer logic could go here, but keeping it simple with oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.linearRampToValueAtTime(400, now + 0.2);
    
    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }
}

export const audioService = new AudioService();