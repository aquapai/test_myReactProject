import React from 'react';
import type { ComparisonResult } from '../types';

const CodeBlock: React.FC<{ children: React.ReactNode, lang?: string }> = ({ children, lang }) => (
    <pre className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto border border-slate-700">
        <code className={lang ? `language-${lang}` : ''}>{children}</code>
    </pre>
);


export const PromptComparison: React.FC<{ data: ComparisonResult }> = ({ data }) => {
  return (
    <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">프롬프트 엔지니어링의 힘</h2>
      <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
        간단한 프롬프트도 좋은 결과를 주지만, 정제되고 구조화된 프롬프트는 신뢰할 수 있고 애플리케이션에 바로 적용 가능한 데이터를 제공합니다. 두 가지를 비교해 보세요.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Simple Prompt Column */}
        <div>
          <h3 className="text-lg font-semibold text-sky-400 mb-3 border-b-2 border-sky-800 pb-2">1. 간단한 프롬프트</h3>
          <p className="text-sm text-slate-400 mb-4">기본적이고 직접적인 요청입니다. 작성하기는 쉽지만 예측 불가능한 형식의 결과가 나올 수 있습니다.</p>
          <CodeBlock>{data.simplePrompt}</CodeBlock>
          
          <h4 className="font-semibold mt-6 mb-2 text-slate-300">결과 (일반 텍스트):</h4>
          <div className="bg-slate-900 rounded-lg p-4 text-sm border border-slate-700 text-slate-300 whitespace-pre-wrap">
              {data.simpleResult}
          </div>
        </div>

        {/* Refined Prompt Column */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-3 border-b-2 border-green-800 pb-2">2. 정제된 프롬프트</h3>
          <p className="text-sm text-slate-400 mb-4">이 프롬프트는 AI에게 역할과 맥락을 부여하고, 특정 JSON 출력 스키마를 요청합니다. 이를 통해 예측 가능하고 구조화된 데이터를 얻을 수 있습니다.</p>
          <CodeBlock>{data.refinedPrompt}</CodeBlock>

          <h4 className="font-semibold mt-6 mb-2 text-slate-300">결과 (구조화된 JSON):</h4>
          <CodeBlock lang="json">
            {JSON.stringify({ suggestions: data.refinedResult }, null, 2)}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
};