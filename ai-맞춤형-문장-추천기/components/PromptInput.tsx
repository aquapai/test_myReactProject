import React, { useState } from 'react';

interface PromptInputProps {
  onGenerate: (topic: string) => void;
  isLoading: boolean;
}

const examplePrompts = [
    "비즈니스 메일 시작 문장",
    "회의를 정중하게 거절하는 방법",
    "판타지 소설의 흥미로운 첫 문장",
    "영업 이메일의 설득력 있는 마무리",
];

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerate(topic);
    }
  };
  
  const handleExampleClick = (prompt: string) => {
    setTopic(prompt);
    onGenerate(prompt);
  }

  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg">
      <form onSubmit={handleSubmit}>
        <label htmlFor="topic-input" className="block mb-2 text-lg font-medium text-slate-300">
          어떤 종류의 문장이 필요하신가요?
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 청구서에 대한 친절한 알림"
            className="flex-grow bg-slate-900/80 border border-slate-600 rounded-lg py-3 px-4 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중...
                </>
            ) : "생성하기"}
          </button>
        </div>
      </form>
       <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-slate-400 self-center">예시를 사용해보세요:</span>
            {examplePrompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => handleExampleClick(prompt)}
                    disabled={isLoading}
                    className="text-sm bg-slate-700/50 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors duration-200 disabled:opacity-50"
                >
                    {prompt}
                </button>
            ))}
        </div>
    </div>
  );
};