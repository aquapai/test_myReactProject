import React from 'react';

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.585a.75.75 0 01.145-.53l3-3a.75.75 0 011.06 1.06l-3 3a.75.75 0 01-.53.145H9.315z"
      clipRule="evenodd"
    />
    <path
      d="M11.623 7.904a.75.75 0 01.328-.124l3.153-.631a.75.75 0 01.87.87l-.631 3.153a.75.75 0 01-1.15.526l-3.375-1.688a.75.75 0 01.205-1.356z"
    />
    <path
      fillRule="evenodd"
      d="M7.585 9.315a.75.75 0 01-.145.53l-3 3a.75.75 0 01-1.06-1.06l3-3a.75.75 0 01.53-.145h1.685z"
      clipRule="evenodd"
    />
    <path
      d="M7.904 11.623a.75.75 0 01-.124-.328l-.631-3.153a.75.75 0 01.87-.87l3.153.631a.75.75 0 01.526 1.15l-1.688 3.375a.75.75 0 01-1.356-.205z"
    />
    <path
      fillRule="evenodd"
      d="M16.415 9.315a.75.75 0 01.53.145l3 3a.75.75 0 01-1.06 1.06l-3-3a.75.75 0 01.145-.53v-1.685z"
      clipRule="evenodd"
    />
    <path
      d="M12.377 7.904a.75.75 0 01.328.124l3.375 1.688a.75.75 0 01-1.022 1.282l-3.153-.631a.75.75 0 01.472-1.463z"
    />
    <path
      fillRule="evenodd"
      d="M9.315 16.415a.75.75 0 01-.53-.145l-3-3a.75.75 0 111.06-1.06l3 3a.75.75 0 01-.145.53v1.685z"
      clipRule="evenodd"
    />
    <path
      d="M7.904 12.377a.75.75 0 01-.124.328l-1.688 3.375a.75.75 0 01-1.282-1.022l.631-3.153a.75.75 0 011.463-.472z"
    />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 flex items-center justify-center gap-3">
          <SparklesIcon className="w-8 h-8" />
          AI 맞춤형 문장 추천기
        </h1>
        <p className="mt-2 text-md text-slate-400">
          Gemini AI로 어떤 상황에도 완벽한 문장을 만들어보세요.
        </p>
      </div>
    </header>
  );
};