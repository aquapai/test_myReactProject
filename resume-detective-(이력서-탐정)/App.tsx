import React, { useState } from 'react';
import { BriefingCard } from './components/BriefingCard.tsx';
import { InvestigationBoard } from './components/InvestigationBoard.tsx';
import { ReportCard } from './components/ReportCard.tsx';
import { audioService } from './services/audioService.ts';
import { fetchRandomCandidate } from './services/scenarioService.ts';
import { GameState, ScanResult, Candidate } from './types.ts';
import { Search, Loader2 } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async () => {
    audioService.init();
    audioService.playClickSound();
    
    setIsLoading(true);
    try {
      const newCandidate = await fetchRandomCandidate();
      setCandidate(newCandidate);
      setGameState('briefing');
    } catch (e) {
      console.error(e);
      alert("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBriefingComplete = () => {
    setGameState('investigation');
  };

  const handleInvestigationComplete = (ids: number[]) => {
    if (!candidate) return;

    setSelectedIds(ids);
    
    // Calculate Results
    const suspiciousSentences = candidate.sentences.filter(
      s => s.type === 'exaggeration' || s.type === 'halo' || s.type === 'vague'
    );
    const normalSentences = candidate.sentences.filter(s => s.type === 'fact');

    const suspiciousFound = ids.filter(id => 
      suspiciousSentences.find(s => s.id === id)
    ).length;

    const falseAlarms = ids.filter(id => 
      normalSentences.find(s => s.id === id)
    ).length;

    const missed = suspiciousSentences.length - suspiciousFound;

    // Simple Halo Score Logic
    let score = 0;
    if (suspiciousSentences.length > 0) {
      score = Math.round(((missed + (falseAlarms * 0.5)) / suspiciousSentences.length) * 100);
    }
    score = Math.min(100, score);

    setScanResult({
      totalSentences: candidate.sentences.length,
      suspiciousFound,
      falseAlarms,
      missed,
      haloScore: score
    });

    setGameState('report');
  };

  const restartGame = () => {
    // Reset and start over with a new candidate
    setScanResult(null);
    setSelectedIds([]);
    startGame();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="relative w-24 h-24 border-4 border-slate-700 rounded-lg overflow-hidden bg-slate-800 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_10px_#4ade80] animate-scan"></div>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        </div>
        <p className="text-xl font-bold animate-pulse text-green-400 font-mono">
          지원자 데이터베이스 스캔 중...
        </p>
        <p className="text-xs text-slate-500">AI가 새로운 시나리오를 생성하고 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black"></div>

      {gameState === 'intro' && (
        <div className="z-10 text-center space-y-8 animate-fade-in">
          <div className="relative inline-block">
            <Search className="w-20 h-20 text-blue-500 mx-auto mb-4 animate-bounce" />
            <div className="absolute -bottom-2 w-full h-4 bg-blue-500/50 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
            RESUME DETECTIVE
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto">
            화려한 스펙 뒤에 숨겨진 '진실'을 찾으세요.<br/>
            후광 효과에 속지 않는 냉철한 탐정이 되어야 합니다.
          </p>
          <button 
            onClick={startGame}
            className="group relative px-8 py-4 bg-blue-600 rounded-full font-bold text-xl text-white shadow-lg shadow-blue-500/30 overflow-hidden hover:scale-105 transition-transform"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative">수사 시작하기</span>
          </button>
        </div>
      )}

      {gameState === 'briefing' && candidate && (
        <div className="z-10 w-full flex justify-center">
          <BriefingCard 
            candidate={candidate} 
            onNext={handleBriefingComplete} 
          />
        </div>
      )}

      {gameState === 'investigation' && candidate && (
        <div className="z-10 w-full h-[80vh] flex justify-center">
          <InvestigationBoard 
            candidate={candidate} 
            onComplete={handleInvestigationComplete} 
          />
        </div>
      )}

      {gameState === 'report' && candidate && scanResult && (
        <div className="z-10 w-full flex justify-center">
          <ReportCard 
            candidate={candidate} 
            result={scanResult} 
            selectedIds={selectedIds}
            onRestart={restartGame}
          />
        </div>
      )}
    </div>
  );
}