import React from 'react';
import type { Suggestion } from '../types';
import { CopyButton } from './CopyButton';

interface SuggestionsOutputProps {
  suggestions: Suggestion[];
}

export const SuggestionsOutput: React.FC<SuggestionsOutputProps> = ({ suggestions }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">AI 추천 문장</h2>
      <div className="grid gap-4 md:grid-cols-1">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-transform hover:scale-[1.02] hover:border-sky-500"
          >
            <div className="flex-grow">
              <p className="text-slate-200">{suggestion.sentence}</p>
              <span className="mt-2 inline-block bg-slate-700 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {suggestion.tone}
              </span>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <CopyButton textToCopy={suggestion.sentence} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};