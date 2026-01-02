import React, { useState } from 'react';
import Navigation from './components/Navigation.tsx';
import Home from './components/Home.tsx';
import Feed from './components/Feed.tsx';
import Profile from './components/Profile.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import AnalysisResultView from './components/AnalysisResultView.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import { AnalysisResult } from './types.ts';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyzeStart = () => {
    setIsLoading(true);
  };

  const handleAnalyzeComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsLoading(false);
    setCurrentView('analysis');
  };

  const handleBackToHome = () => {
    setAnalysisResult(null);
    setCurrentView('home');
  };

  const renderContent = () => {
    if (isLoading) return <LoadingScreen />;

    if (currentView === 'analysis' && analysisResult) {
      return <AnalysisResultView result={analysisResult} onBack={handleBackToHome} />;
    }

    switch (currentView) {
      case 'home':
        return <Home onAnalyzeStart={handleAnalyzeStart} onAnalyzeComplete={handleAnalyzeComplete} />;
      case 'feed':
        return <Feed />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onAnalyzeStart={handleAnalyzeStart} onAnalyzeComplete={handleAnalyzeComplete} />;
    }
  };

  return (
    <div className="h-screen w-full bg-zinc-950 text-white overflow-hidden flex flex-col font-sans">
      <div className="flex-grow overflow-hidden relative">
        {renderContent()}
      </div>
      
      {!isLoading && currentView !== 'analysis' && (
        <Navigation currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
}

export default App;
