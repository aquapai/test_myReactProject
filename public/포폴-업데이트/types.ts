export interface AnalysisResult {
  haloScore: HaloScore;
  feedback: HaloFeedback[];
  overallSummary: string;
}

export interface HaloScore {
  authority: number; // Reliability, prestige
  numbers: number;   // Quantification
  visualImpact: number; // First impression, clarity
}

export interface HaloFeedback {
  category: 'Authority' | 'Numbers' | 'Visual';
  issue: string;
  suggestion: string;
}

export interface RevisedContent {
  original: string;
  revised: string;
  explanation: string;
}

export enum AppStep {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  REVISION = 'REVISION',
}
