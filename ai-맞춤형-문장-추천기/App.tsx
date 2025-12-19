import React, { useState } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { SuggestionsOutput } from './components/SuggestionsOutput';
import { PromptComparison } from './components/PromptComparison';
import { Loader } from './components/Loader';
import { getSentenceSuggestions } from './services/geminiService';
import type { ComparisonResult, Suggestion } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [mainSuggestions, setMainSuggestions] = useState<Suggestion[]>([]);

  const handleGenerate = async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setComparisonResult(null);
    setMainSuggestions([]);

    try {
      const result = await getSentenceSuggestions(topic);
      setComparisonResult(result);
      setMainSuggestions(result.refinedResult);
    } catch (err) {
      setError(err instanceof Error ? `오류가 발생했습니다: ${err.message}` : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

          {isLoading && <Loader />}

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg">
              <p className="font-bold">오류</p>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && mainSuggestions.length > 0 && (
            <SuggestionsOutput suggestions={mainSuggestions} />
          )}

          {!isLoading && comparisonResult && (
            <PromptComparison data={comparisonResult} />
          )}
          
          {!isLoading && !error && !comparisonResult && (
            <div className="mt-12 text-center text-slate-500">
                <p className="text-lg">주제를 입력하고 AI가 문장을 추천하는 과정을 확인해보세요!</p>
                <p>예시: "비즈니스 메일 정중한 거절 표현"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;