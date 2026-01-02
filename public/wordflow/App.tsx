import React, { useState, useEffect } from 'react';
import { AppMode, WordChunk, Word } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import FileUpload from './components/FileUpload.tsx';
import LearningMode from './components/LearningMode.tsx';
import QuizMode from './components/QuizMode.tsx';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [chunks, setChunks] = useState<WordChunk[]>([]);
  const [activeChunkId, setActiveChunkId] = useState<number | null>(null);

  // Load data from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wordflow-data');
    if (saved) {
      try {
        setChunks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data");
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('wordflow-data', JSON.stringify(chunks));
  }, [chunks]);

  const handleUpload = (newChunks: WordChunk[]) => {
    setChunks(prev => [...prev, ...newChunks]);
    setMode(AppMode.DASHBOARD);
  };

  const handleChunkComplete = (updatedWords: Word[]) => {
    setChunks(prev => prev.map(c => {
      if (c.id === activeChunkId) {
        return { ...c, words: updatedWords, isCompleted: true }; // Mark as learned tentatively
      }
      return c;
    }));
    // Transition to Quiz immediately for Flow
    setMode(AppMode.QUIZ);
  };

  const handleQuizFinish = () => {
      setMode(AppMode.DASHBOARD);
      setActiveChunkId(null);
  };

  const getActiveChunk = () => chunks.find(c => c.id === activeChunkId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {mode === AppMode.DASHBOARD && (
        <Dashboard 
            chunks={chunks} 
            setMode={setMode} 
            setActiveChunk={setActiveChunkId} 
        />
      )}

      {mode === AppMode.UPLOAD && (
        <FileUpload 
            onUpload={handleUpload} 
            onCancel={() => setMode(AppMode.DASHBOARD)} 
        />
      )}

      {mode === AppMode.LEARNING && activeChunkId && getActiveChunk() && (
        <LearningMode 
            chunk={getActiveChunk()!} 
            onComplete={handleChunkComplete}
            onExit={() => setMode(AppMode.DASHBOARD)}
        />
      )}

      {mode === AppMode.QUIZ && activeChunkId && getActiveChunk() && (
        <QuizMode 
            chunk={getActiveChunk()!}
            onFinish={handleQuizFinish}
        />
      )}
    </div>
  );
};

export default App;
