import React from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6">
      <div className="relative">
        {/* Flickering Light Effect */}
        <div className="absolute inset-0 bg-yellow-400/30 blur-3xl rounded-full animate-pulse"></div>
        <Lightbulb size={80} className="text-yellow-400 relative z-10 animate-[pulse_0.5s_infinite]" fill="currentColor" />
        <Loader2 size={40} className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-zinc-600 animate-spin" />
      </div>
      
      <h2 className="mt-16 text-2xl font-display text-white text-center animate-pulse">
        거품 걷어내는 중...
      </h2>
      <p className="text-zinc-500 text-sm mt-2 text-center font-medium">
        AI가 기레기력을 측정하고 있습니다.
      </p>

      {/* Steps */}
      <div className="mt-12 w-full max-w-xs space-y-4">
         <div className="flex items-center gap-3 text-sm font-bold text-zinc-500">
           <div className="w-3 h-3 rounded-full bg-green-500 animate-[bounce_1s_infinite]"></div>
           <span>1. 기사 내용 뜯어보기</span>
         </div>
         <div className="flex items-center gap-3 text-sm font-bold text-zinc-500">
           <div className="w-3 h-3 rounded-full bg-yellow-500 animate-[bounce_1s_infinite_200ms]"></div>
           <span>2. 감성팔이/어그로 탐지 (MSG 측정)</span>
         </div>
         <div className="flex items-center gap-3 text-sm font-bold text-zinc-500">
           <div className="w-3 h-3 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></div>
           <span>3. 팩트 DB랑 맞짱 뜨는 중</span>
         </div>
      </div>
    </div>
  );
};

export default LoadingScreen;