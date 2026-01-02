export enum QuizCategory {
  DAILY = '오늘의 챌린지',
  BUSINESS = '수능/학업 스트레스 타파',
  FUTURE = '미래 상상',
  OBJECT = '사물의 재발견',
  REVERSE = '거꾸로 생각하기',
}

export interface Quiz {
  id: string;
  category: QuizCategory;
  question: string;
  context?: string;
}

export interface CreativityScores {
  divergence: number; // Variety of ideas
  originality: number; // Uniqueness
  flexibility: number; // Perspective shifting
  logic: number; // Logical flow within the creative context
  humor: number; // Wit and engagement
}

export interface AnalysisResult {
  scores: CreativityScores;
  feedback: string;
  improvementTip: string;
  totalScore: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  quiz: Quiz;
  userAnswer: string;
  analysis: AnalysisResult;
}