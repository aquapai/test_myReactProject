export interface Suggestion {
  sentence: string;
  tone: string;
}

export interface ComparisonResult {
  simplePrompt: string;
  simpleResult: string;
  refinedPrompt: string;
  refinedResult: Suggestion[];
}
