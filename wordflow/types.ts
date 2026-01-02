export interface Word {
  id: string;
  term: string;
  definition: string;
  example?: string;
  learned: boolean;
  correctCount: number;
  incorrectCount: number;
}

export interface WordChunk {
  id: number;
  words: Word[];
  isCompleted: boolean;
}

export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  LEARNING = 'LEARNING',
  QUIZ = 'QUIZ',
  UPLOAD = 'UPLOAD',
}

export interface LearningSession {
  chunkId: number;
  currentIndex: number;
  isFlipped: boolean;
}
