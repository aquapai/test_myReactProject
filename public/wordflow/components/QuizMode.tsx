import React, { useState } from 'react';
import { Word, WordChunk } from '../types';
import { audioService } from '../services/audioService';
import { Check, X, Trophy, RotateCcw, Home } from 'lucide-react';

interface QuizModeProps {
  chunk: WordChunk;
  onFinish: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ chunk, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Shuffle words for quiz content, but keep question order consistent for now
  // In a real app, we might want to randomize question order too.
  const currentWord = chunk.words[currentQuestionIndex];
  
  // Generate 3 distractors
  const generateOptions = () => {
    const distractors = chunk.words
        .filter(w => w.id !== currentWord.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.definition);
    
    const options = [...distractors, currentWord.definition];
    return options.sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState<string[]>(generateOptions());

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent double click

    setSelectedAnswer(answer);
    const correct = answer === currentWord.definition;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      audioService.playSuccess();
    } else {
      audioService.playError();
    }

    // Auto advance after delay
    setTimeout(() => {
      if (currentQuestionIndex < chunk.words.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setIsCorrect(null);
        // Need to update options for next question manually since component doesn't remount
        // This is a bit tricky in React functional components without effects, 
        // but we can just rely on a simple effect or function call.
        // Let's force a re-render logic by relying on the `key` prop in parent or state update.
        // Actually, simpler: update options inside this timeout.
        
        const nextWord = chunk.words[nextIndex];
        const nextDistractors = chunk.words
            .filter(w => w.id !== nextWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => w.definition);
        setOptions([...nextDistractors, nextWord.definition].sort(() => 0.5 - Math.random()));
        
        audioService.speak(nextWord.term); // Speak next word
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
      const percentage = Math.round((score / chunk.words.length) * 100);
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
              <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md text-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
                  <p className="text-slate-500 mb-8">수고하셨습니다.</p>
                  
                  <div className="text-5xl font-extrabold text-brand-600 mb-2">{score} / {chunk.words.length}</div>
                  <p className="text-sm font-medium text-slate-400 mb-8">{percentage}% 정답률</p>

                  <button 
                    onClick={onFinish}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Home className="w-5 h-5" />
                    메인으로 돌아가기
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-400">Quiz {currentQuestionIndex + 1} / {chunk.words.length}</span>
                <span className="text-sm font-bold text-brand-600">Score: {score}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-500 transition-all duration-300" 
                    style={{ width: `${((currentQuestionIndex) / chunk.words.length) * 100}%` }}
                />
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">{currentWord.term}</h2>
                <p className="text-slate-400 text-sm">알맞은 뜻을 선택하세요</p>
            </div>

            <div className="w-full space-y-3">
                {options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isTarget = option === currentWord.definition;
                    
                    let buttonStyle = "bg-white border-slate-200 text-slate-600 hover:border-brand-400 hover:shadow-md";
                    
                    if (selectedAnswer) {
                        if (isTarget) {
                            buttonStyle = "bg-green-50 border-green-500 text-green-700";
                        } else if (isSelected && !isTarget) {
                            buttonStyle = "bg-red-50 border-red-500 text-red-700";
                        } else {
                            buttonStyle = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={!!selectedAnswer}
                            onClick={() => handleAnswer(option)}
                            className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
                        >
                            <span>{option}</span>
                            {selectedAnswer && isTarget && <Check className="w-5 h-5" />}
                            {selectedAnswer && isSelected && !isTarget && <X className="w-5 h-5" />}
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default QuizMode;
