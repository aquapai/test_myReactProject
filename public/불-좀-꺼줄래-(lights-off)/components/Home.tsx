import React, { useState } from 'react';
import { Search, Lightbulb, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { analyzeNews } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface HomeProps {
  onAnalyzeStart: () => void;
  onAnalyzeComplete: (result: AnalysisResult) => void;
}

const Home: React.FC<HomeProps> = ({ onAnalyzeStart, onAnalyzeComplete }) => {
  const [inputText, setInputText] = useState('');

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    onAnalyzeStart();
    const result = await analyzeNews(inputText);
    onAnalyzeComplete(result);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto pb-20">
      {/* Breaking News Banner - B-grade style */}
      <div className="bg-yellow-400 border-b-4 border-black py-2 px-4 flex items-center gap-2 overflow-hidden whitespace-nowrap shadow-md z-10">
        <AlertTriangle size={18} className="text-black shrink-0 animate-bounce" fill="white" />
        <p className="text-sm text-black font-black font-display animate-marquee">
          [속보] "숨만 쉬어도 살 빠진다" 기사, 낚시 판정... 헬스장 관장님 격노
        </p>
      </div>

      <div className="px-6 pt-12 pb-8 flex flex-col items-center justify-center grow min-h-[60vh]">
        <div className="mb-6 relative group">
           <div className="absolute inset-0 bg-yellow-400 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
           <Lightbulb size={80} className="text-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] transform group-hover:rotate-12 transition-transform duration-300" strokeWidth={1.5} />
           <div className="absolute -right-2 -top-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full rotate-12 border-2 border-black">
             OFF!
           </div>
        </div>
        
        <h1 className="text-5xl font-display mb-2 text-center leading-tight">
          불 좀 <span className="text-yellow-400 inline-block transform hover:scale-110 transition-transform cursor-pointer">꺼줄래?</span>
        </h1>
        <p className="text-zinc-400 text-base text-center mb-8 max-w-[280px] font-medium break-keep">
          눈부신 어그로 뒤에 숨은 <span className="text-white border-b-2 border-yellow-400">팩트</span>만 발라드림.
        </p>

        <div className="w-full max-w-md bg-zinc-900 rounded-xl p-2 border-2 border-zinc-800 focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/20 transition-all shadow-[4px_4px_0px_0px_rgba(39,39,42,1)] focus-within:shadow-[4px_4px_0px_0px_rgba(250,204,21,1)]">
          <textarea
            className="w-full bg-transparent text-white p-3 min-h-[100px] resize-none focus:outline-none text-base placeholder-zinc-600 font-medium"
            placeholder="여기에 낚시성 기사 링크나 카톡 찌라시 붙여넣어 보셈."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
          />
          <div className="flex justify-between items-center px-2 pb-2">
             <span className="text-xs text-zinc-500 font-bold font-mono">POWERED BY GEMINI</span>
             <button 
                onClick={handleAnalyze}
                disabled={!inputText.trim()}
                className="bg-yellow-400 hover:bg-yellow-300 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-lg p-2 transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
             >
               <ArrowRight size={24} strokeWidth={3} />
             </button>
          </div>
        </div>

        {/* Quick Tips - B-grade style */}
        <div className="mt-12 w-full max-w-md grid grid-cols-2 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl border-2 border-zinc-800 hover:-translate-y-1 transition-transform">
            <h3 className="text-yellow-400 text-sm font-black mb-1 flex items-center gap-1">
              <Zap size={14} className="fill-yellow-400" /> MSG(후광)란?
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed break-keep">
              팩트보다 감성을 자극해서 님들을 낚는 기술임. 제목 어그로, 과장된 썸네일 조심!
            </p>
          </div>
           <div className="bg-zinc-900 p-4 rounded-xl border-2 border-zinc-800 hover:-translate-y-1 transition-transform">
            <h3 className="text-green-400 text-sm font-black mb-1 flex items-center gap-1">
              <Search size={14} /> 팩트 체크 팁
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed break-keep">
              "충격", "경악", "속보" 같은 단어 들어가면 일단 의심부터 하고 보는 게 국룰.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;