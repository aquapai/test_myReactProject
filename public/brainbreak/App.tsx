import React, { useState } from 'react';
import { QuizCategory, Quiz, AnalysisResult, HistoryItem } from './types.ts';
import { Dashboard } from './components/Dashboard.tsx';
import { QuizSession } from './components/QuizSession.tsx';
import { audioService } from './services/audioService.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'quiz'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  
  // Persist history in local state (simulating database for this demo)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('brainbreak_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleStartQuiz = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (quiz: Quiz, userAnswer: string, analysis: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      quiz,
      userAnswer,
      analysis
    };
    
    const newHistory = [...history, newItem];
    setHistory(newHistory);
    localStorage.setItem('brainbreak_history', JSON.stringify(newHistory));
  };

  const handleExitQuiz = () => {
    audioService.playClick();
    setCurrentView('dashboard');
    setSelectedCategory(null);
  };

  const handleHomeClick = () => {
    audioService.playClick();
    setCurrentView('dashboard');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={handleHomeClick}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">BrainBreak</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://ai.google.dev/" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Powered by Gemini
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-6">
        {currentView === 'dashboard' ? (
          <Dashboard 
            history={history} 
            onSelectCategory={handleStartQuiz} 
          />
        ) : (
          selectedCategory && (
            <QuizSession 
              category={selectedCategory} 
              onExit={handleExitQuiz}
              onComplete={handleQuizComplete}
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;