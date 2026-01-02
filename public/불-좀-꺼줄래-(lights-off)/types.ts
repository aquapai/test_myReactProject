export enum TruthLabel {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
  MIXED = 'MIXED',
  UNVERIFIED = 'UNVERIFIED',
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  title: string; // The detected title or headline
  summary: string;
  truthLabel: TruthLabel;
  confidenceScore: number; // 0-100
  haloScore: number; // 0-100 (High means high distortion/sensationalism)
  haloFactors: string[]; // Reasons why it has a halo effect (e.g., "Emotional language")
  keyPoints: string[];
  sources: GroundingSource[];
}

export interface UserProfile {
  name: string;
  title: string; // e.g., "후광 사냥꾼 브론즈"
  points: number;
  trustIndex: number; // 0-100
  historyCount: number;
  badges: string[];
}

export interface NewsCardData {
  id: string;
  title: string;
  thumbnail?: string;
  truthLabel: TruthLabel;
  haloScore: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  title: string;
  points: number;
  avatarColor: string;
}
