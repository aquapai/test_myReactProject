
export enum AppStep {
  INPUT = 'input',
  THINKING = 'thinking',
  EXPANSION = 'expansion',
  LOADING = 'loading'
}

export interface ThinkingResult {
  questions: string[];
  intent: string;
}

export interface ExpansionResult {
  perspective: string;
  analogy: string;
  counter: string;
}
