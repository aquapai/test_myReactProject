import React, { useState, useEffect, useCallback } from 'react';
import { Word, WordChunk } from '../types';
import { audioService } from '../services/audioService';
import { generateExplanation } from '../services/geminiService';
import { Volume2, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

interface LearningModeProps {
  chunk: WordChunk;
  onComplete: (updatedWords: Word[]) => void;
  onExit: () => void;
}

const LearningMode: React.FC<LearningModeProps> = ({ chunk, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [words, setWords] = useState<Word[]>(chunk.words);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const currentWord = words[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    audioService.playFlip();
  }, []);

  useEffect(() => {
    if (!isFlipped) {
        const timer = setTimeout(() => {
             audioService.speak(currentWord.term);
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [currentIndex, isFlipped, currentWord.term]);

  const handleNext = () => {
    setAiExplanation(null);
    if (currentIndex < words.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(words);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
        setIsFlipped(false);
        setAiExplanation(null);
        setCurrentIndex(prev => prev - 1);
    }
  };

  const handleAskAi = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (aiExplanation) return;
    
    setIsLoadingAi(true);
    const explanation = await generateExplanation(currentWord.term);
    setAiExplanation(explanation);
    setIsLoadingAi(false);
  };

  const markAsKnown = (e: React.MouseEvent) => {
      e.stopPropagation();
      const updatedWords = [...words];
      updatedWords[currentIndex].learned = true;
      setWords(updatedWords);
      audioService.playSuccess();
      handleNext();
  };

  const progress = ((currentIndex + 1) / words.length) * 100;

  // Adaptive Font Size logic
  const getFontSize = (text: string) => {
      if (text.length > 15) return 'text-3xl';
      if (text.length > 10) return 'text-4xl';
      return 'text-5xl';
  };

  return (
    <div className="h-screen max-h-[900px] flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-white shadow-sm z-10">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1 rounded hover:bg-slate-100">
           ✕ 그만하기
        </button>
        <div className="flex-1 mx-6 max-w-md">
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
             </div>
             <p className="text-xs text-center text-slate-400 mt-1 font-medium tracking-wide">
                {currentIndex + 1} / {words.length}
             </p>
        </div>
        <div className="w-16"></div> 
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative w-full max-w-3xl mx-auto">
        
        <div 
            className="relative w-full max-w-md aspect-[3/4] cursor-pointer perspective-1000 group"
            onClick={handleFlip}
        >
             <div className={`relative w-full h-full transition-transform duration-500 preserve-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Front (English) */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl p-8 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                     <div className="text-brand-200 text-xs font-extrabold uppercase tracking-[0.2em] mb-6">Word</div>
                     
                     <div className="flex-1 flex items-center justify-center w-full">
                        <h2 className={`${getFontSize(currentWord.term)} font-extrabold text-slate-800 text-center break-words w-full leading-tight px-2`}>
                            {currentWord.term}
                        </h2>
                     </div>
                     
                     <button 
                        onClick={(e) => { e.stopPropagation(); audioService.speak(currentWord.term); }}
                        className="p-4 rounded-full bg-brand-50 text-brand-500 hover:bg-brand-100 hover:text-brand-600 transition-all hover:scale-110 active:scale-95 mb-8"
                        aria-label="Listen pronunciation"
                     >
                         <Volume2 className="w-7 h-7" />
                     </button>

                     <div className="absolute bottom-6 text-slate-300 text-xs font-medium animate-pulse">
                        탭하여 뜻 확인하기
                     </div>
                </div>

                {/* Back (Definition & AI) */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-800 text-white rounded-3xl overflow-hidden flex flex-col">
                     <div className="flex-1 overflow-y-auto p-8 scrollbar-hide flex flex-col items-center">
                        <div className="text-slate-400 text-xs font-extrabold uppercase tracking-[0.2em] mb-6 mt-4">Meaning</div>
                        
                        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 leading-snug break-keep text-white">
                            {currentWord.definition}
                        </h3>
                        
                        {currentWord.example && (
                            <div className="w-full bg-slate-700/50 rounded-xl p-4 mb-6 border border-slate-600/50">
                                <p className="text-brand-100 text-center text-sm sm:text-base italic font-serif">
                                    "{currentWord.example}"
                                </p>
                            </div>
                        )}

                        {/* AI Section */}
                        <div className="w-full mt-auto pt-4 border-t border-slate-700">
                            {!aiExplanation && !isLoadingAi && (
                                <button 
                                    onClick={handleAskAi}
                                    className="w-full py-3 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 rounded-xl transition-all text-sm font-bold shadow-lg shadow-brand-900/50"
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                    AI 선생님 설명 듣기
                                </button>
                            )}
                            {isLoadingAi && (
                                <div className="text-slate-400 text-sm text-center py-2 flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-100" />
                                    <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-200" />
                                </div>
                            )}
                            {aiExplanation && (
                                <div className="bg-slate-700 rounded-xl p-4 text-sm text-slate-200 text-left leading-relaxed border border-slate-600 animate-fadeIn">
                                    <div className="flex items-center gap-2 mb-2 text-brand-300 font-bold text-xs uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3" /> Insight
                                    </div>
                                    {aiExplanation}
                                </div>
                            )}
                        </div>
                     </div>
                </div>
             </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 bg-white border-t border-slate-100 flex justify-center items-center gap-6 sm:gap-12 pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
         <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-4 text-slate-300 disabled:opacity-20 hover:text-slate-500 hover:bg-slate-50 rounded-full transition-all active:scale-95"
         >
             <ArrowLeft className="w-7 h-7" />
         </button>

        <button
            onClick={markAsKnown}
            className="flex flex-col items-center gap-2 group"
        >
             <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-emerald-200 group-hover:shadow-lg group-active:scale-95">
                <CheckCircle className="w-7 h-7" />
             </div>
             <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8">외웠어요!</span>
        </button>

         <button 
            onClick={handleNext}
            className="p-4 text-brand-500 hover:text-brand-700 hover:bg-brand-50 rounded-full transition-all active:scale-95"
         >
             <ArrowRight className="w-7 h-7" />
         </button>
      </div>
    </div>
  );
};

export default LearningMode;