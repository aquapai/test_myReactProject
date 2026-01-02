export interface Sentence {
  id: number;
  text: string;
  type: 'fact' | 'exaggeration' | 'halo' | 'vague';
  reason: string; // Why it is trustworthy or suspicious
}

export interface Candidate {
  id: string;
  name: string;
  age: number;
  photoUrl: string;
  education: string;
  major: string;
  summary: string[]; // Highly impressive summary points (Halo triggers)
  resumeTitle: string;
  sentences: Sentence[];
}

export type GameState = 'intro' | 'briefing' | 'investigation' | 'report';

export interface ScanResult {
  totalSentences: number;
  suspiciousFound: number;
  falseAlarms: number;
  missed: number;
  haloScore: number; // 0 to 100, higher means more susceptible to Halo Effect
}