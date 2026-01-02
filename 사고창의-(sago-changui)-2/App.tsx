
import React, { useState, useEffect } from 'react';
import { audioService } from './services/audioService.ts';
import { 
  getThinkingQuestions, 
  getCreativeExpansion, 
  getComparisonData, 
  getDailyMission 
} from './services/geminiService.ts';

interface QuestionSet {
  questions: string[];
  intent: string;
}

interface CreativeSet {
  perspective: string;
  analogy: string;
  counter: string;
}

interface ComparisonSet {
  genericAnswer: string;
  uniqueValue: string;
}

interface DailyMission {
  mission: string;
  tip: string;
}

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'thinking' | 'expansion' | 'comparison' | 'loading'>('input');
  const [userInput, setUserInput] = useState('');
  const [userThoughts, setUserThoughts] = useState<string[]>(['', '', '']);
  const [thinkingSet, setThinkingSet] = useState<QuestionSet | null>(null);
  const [creativeSet, setCreativeSet] = useState<CreativeSet | null>(null);
  const [comparison, setComparison] = useState<ComparisonSet | null>(null);
  const [dailyMission, setDailyMission] = useState<DailyMission | null>(null);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const mission = await getDailyMission();
        setDailyMission(mission);
      } catch (e) {
        console.error("Mission error", e);
      }
    };
    fetchMission();
  }, []);

  const handleStartThinking = async (prompt?: string) => {
    const targetPrompt = prompt || userInput;
    if (!targetPrompt.trim()) return;
    if (prompt) setUserInput(prompt);
    
    audioService.playClick();
    setStep('loading');
    try {
      const result = await getThinkingQuestions(targetPrompt);
      setThinkingSet(result);
      setStep('thinking');
    } catch (error) {
      console.error(error);
      setStep('input');
    }
  };

  const handleCompleteThinking = async () => {
    audioService.playSuccess();
    setStep('loading');
    try {
      const combinedThoughts = userThoughts.join(' ');
      const [expansion, compare] = await Promise.all([
        getCreativeExpansion(userInput, combinedThoughts),
        getComparisonData(userInput, combinedThoughts)
      ]);
      setCreativeSet(expansion);
      setComparison(compare);
      setStep('expansion');
    } catch (error) {
      console.error(error);
      setStep('thinking');
    }
  };

  const handleShowComparison = () => {
    audioService.playClick();
    setStep('comparison');
  };

  const handleReset = () => {
    audioService.playClick();
    setStep('input');
    setUserInput('');
    setUserThoughts(['', '', '']);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 overflow-x-hidden">
      <header className="fixed top-0 w-full p-4 glass-morphism z-50 flex justify-between items-center px-8 border-b border-indigo-100">
        <h1 className="text-xl font-bold text-indigo-900 tracking-tight">사고창의</h1>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-indigo-600 font-medium uppercase tracking-widest">Active Thinking</span>
        </div>
      </header>

      <main className="w-full max-w-2xl mt-24 mb-12 px-4 transition-all duration-500 flex flex-col items-center">
        {step === 'loading' && (
          <div className="flex flex-col items-center space-y-4 animate-pulse py-20">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-700 font-medium">AI가 당신의 깊은 사고를 위한 길을 닦고 있어요...</p>
          </div>
        )}

        {step === 'input' && (
          <div className="w-full space-y-6">
            {dailyMission && (
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl transform transition hover:scale-[1.02] cursor-pointer"
                   onClick={() => handleStartThinking(dailyMission.mission)}>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">DAILY MISSION</span>
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-2">"{dailyMission.mission}"</h3>
                <p className="text-sm text-indigo-100 italic opacity-80">{dailyMission.tip}</p>
              </div>
            )}

            <div className="glass-morphism p-8 rounded-3xl shadow-lg border border-white space-y-6 w-full">
              <h2 className="text-2xl font-bold text-gray-800">무엇을 깊게 파고들까요?</h2>
              <textarea
                className="w-full h-32 p-4 rounded-2xl border border-indigo-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-lg"
                placeholder="질문이나 고민을 입력하세요..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button
                onClick={() => handleStartThinking()}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:shadow-indigo-200 hover:shadow-lg transition-all"
              >
                생각의 엔진 가동하기
              </button>
            </div>
          </div>
        )}

        {step === 'thinking' && thinkingSet && (
          <div className="w-full glass-morphism p-8 rounded-3xl shadow-xl space-y-8 animate-fadeIn border border-white">
            <div className="space-y-2 border-b border-indigo-50 pb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">사고 훈련 중</span>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">질문을 통해 답을 직접 찾아보세요</h2>
              <p className="text-sm text-gray-500 font-medium italic">"{userInput}"에 대한 사고 가이드</p>
            </div>

            <div className="space-y-8">
              {thinkingSet.questions.map((q, idx) => (
                <div key={idx} className="space-y-3 transform transition-all focus-within:translate-x-1">
                  <label className="text-md font-bold text-indigo-800 flex items-center">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">{idx + 1}</span>
                    {q}
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-gray-100 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm transition-all"
                    value={userThoughts[idx]}
                    onChange={(e) => {
                      const newThoughts = [...userThoughts];
                      newThoughts[idx] = e.target.value;
                      setUserThoughts(newThoughts);
                    }}
                    placeholder="당신의 직관을 적어보세요."
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleCompleteThinking}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
            >
              사고 정리 및 결과 보기
            </button>
          </div>
        )}

        {step === 'expansion' && creativeSet && (
          <div className="w-full space-y-6 animate-fadeIn">
            <div className="glass-morphism p-8 rounded-3xl shadow-xl border border-white space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">사고의 타임라인</h2>
              <div className="relative border-l-2 border-indigo-200 ml-4 space-y-8 py-2">
                <TimelineItem title="최초 질문" content={userInput} color="bg-indigo-400" />
                <TimelineItem title="나의 사고" content={userThoughts.filter(t => t).join(' | ')} color="bg-emerald-400" />
                <TimelineItem title="창의적 확장" content={creativeSet.perspective} color="bg-amber-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SmallCard title="비유" content={creativeSet.analogy} icon="🎭" />
              <SmallCard title="반대 의견" content={creativeSet.counter} icon="⚖️" />
            </div>

            <button
              onClick={handleShowComparison}
              className="w-full py-4 bg-indigo-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
            >
              AI와 나의 사고력 비교하기
            </button>
          </div>
        )}

        {step === 'comparison' && comparison && (
          <div className="w-full glass-morphism p-8 rounded-3xl shadow-xl space-y-8 animate-fadeIn border border-white">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">사고의 가치 증명</h2>
              <p className="text-indigo-600 font-medium">당신은 AI보다 더 깊게 고민했습니다.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-100 p-6 rounded-2xl space-y-3 opacity-70">
                <h3 className="font-bold text-gray-500 flex items-center">🤖 일반적인 AI 답변</h3>
                <p className="text-sm text-gray-600 leading-relaxed italic">{comparison.genericAnswer}</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl space-y-3 border border-indigo-100">
                <h3 className="font-bold text-indigo-700 flex items-center">🧠 나의 고유한 생각</h3>
                <p className="text-sm text-gray-800 leading-relaxed">{userThoughts.join(' ')}</p>
                <div className="mt-4 pt-4 border-t border-indigo-200">
                  <p className="text-xs font-bold text-indigo-500 uppercase">AI의 평가</p>
                  <p className="text-sm font-bold text-indigo-900">"{comparison.uniqueValue}"</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-4 bg-gray-200 text-gray-800 rounded-2xl font-bold hover:bg-gray-300 transition-all"
            >
              새로운 생각 시작하기
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const TimelineItem: React.FC<{ title: string; content: string; color: string }> = ({ title, content, color }) => (
  <div className="relative pl-8">
    <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm ${color}`}></div>
    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{title}</h4>
    <p className="text-sm text-gray-800 font-medium leading-relaxed">{content || "입력된 내용이 없습니다."}</p>
  </div>
);

const SmallCard: React.FC<{ title: string; content: string; icon: string }> = ({ title, content, icon }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 space-y-2">
    <div className="flex items-center space-x-2">
      <span className="text-lg">{icon}</span>
      <h4 className="font-bold text-gray-700 text-sm">{title}</h4>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed">{content}</p>
  </div>
);

export default App;
