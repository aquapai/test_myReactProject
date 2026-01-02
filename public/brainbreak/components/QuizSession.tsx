import React, { useState, useEffect } from 'react';
import { Quiz, QuizCategory, AnalysisResult } from '../types';
import { generateQuiz, analyzeAnswer } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { Button } from './ui/Button.tsx';
import { AnalysisView } from './AnalysisView.tsx';
import { PenTool, Timer, ArrowLeft, RefreshCw } from 'lucide-react';

interface QuizSessionProps {
  category: QuizCategory;
  onExit: () => void;
  onComplete: (quiz: Quiz, answer: string, analysis: AnalysisResult) => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({ category, onExit, onComplete }) => {
  const [status, setStatus] = useState<'loading' | 'active' | 'analyzing' | 'result'>('loading');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answer, setAnswer] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [timer, setTimer] = useState(0);

  // Load quiz on mount
  useEffect(() => {
    const loadQuiz = async () => {
      setStatus('loading');
      audioService.playStart();
      const newQuiz = await generateQuiz(category);
      setQuiz(newQuiz);
      setStatus('active');
    };
    loadQuiz();
  }, [category]);

  // Timer
  useEffect(() => {
    let interval: number;
    if (status === 'active') {
      interval = window.setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = async () => {
    if (!quiz || !answer.trim()) return;
    audioService.playClick();
    setStatus('analyzing');
    const result = await analyzeAnswer(quiz, answer);
    setAnalysis(result);
    setStatus('result');
    audioService.playSuccess();
    onComplete(quiz, answer, result);
  };

  const handleNextQuiz = () => {
    audioService.playClick();
    setAnswer('');
    setAnalysis(null);
    setTimer(0);
    setStatus('loading');
    generateQuiz(category).then((q) => {
      setQuiz(q);
      setStatus('active');
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">뉴런 연결 중...</h3>
          <p className="text-slate-500 mt-2">{category} 문제를 생성하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (status === 'result' && analysis) {
    return <AnalysisView result={analysis} onHome={onExit} onRetry={handleNextQuiz} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-8 py-4">
        <button 
          onClick={onExit}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> 나가기
        </button>
        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-mono text-sm font-medium">
          <Timer className="w-4 h-4" />
          {formatTime(timer)}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-100 relative overflow-hidden transition-all duration-500 ease-out transform translate-y-0">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <RefreshCw className="w-32 h-32 text-indigo-900 rotate-12" />
        </div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            {category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-4 break-keep">
            {quiz?.question}
          </h2>
          {quiz?.context && (
            <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-200">
              <p className="text-slate-600 italic text-lg leading-relaxed break-keep">"{quiz.context}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Answer Input */}
      <div className="space-y-4 animate-slide-up">
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="떠오르는 생각을 자유롭게 적어보세요. 정답은 없습니다!"
            className="w-full h-48 p-6 text-lg rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 resize-none shadow-sm transition-all placeholder:text-slate-300 bg-white"
            disabled={status === 'analyzing'}
          />
          <PenTool className="absolute right-4 bottom-4 text-slate-300 w-6 h-6" />
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={!answer.trim()}
            isLoading={status === 'analyzing'}
            className="w-full md:w-auto min-w-[200px] text-lg"
          >
            내 생각 분석하기
          </Button>
        </div>
      </div>
    </div>
  );
};