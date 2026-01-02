import React, { useState } from 'react';
import { ViewState, Message, Experience, Activity } from './types.ts';
import ChatInterface from './components/ChatInterface.tsx';
import AnalysisView from './components/AnalysisView.tsx';
import RecommendationView from './components/RecommendationView.tsx';
import { analyzeExperiences, getRecommendations } from './services/geminiService.ts';
import { audioService } from './services/audioService.ts';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('onboarding');
  const [history, setHistory] = useState<Message[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [recommendations, setRecommendations] = useState<Activity[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 뷰 전환 헬퍼 (소리 재생 포함)
  const changeView = (newView: ViewState) => {
    audioService.playTransition();
    setView(newView);
  };

  // 1. 분석 시작 (Chat -> Analysis)
  const handleAnalyze = async () => {
    changeView('analysis');
    setIsProcessing(true);
    try {
      const results = await analyzeExperiences(history);
      setExperiences(results);
      if (results.length > 0) audioService.playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. 추천 받기 (Analysis -> Recommendation)
  const handleRecommend = async () => {
    changeView('recommendation');
    setIsProcessing(true);
    try {
      const results = await getRecommendations(experiences);
      setRecommendations(results);
      if (results.length > 0) audioService.playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. 리셋
  const handleReset = () => {
    setHistory([]);
    setExperiences([]);
    setRecommendations([]);
    changeView('onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 h-[800px] max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white flex flex-col relative">
        
        {/* 온보딩 화면 */}
        {view === 'onboarding' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center">
            <div className="mb-6 animate-bounce">
              <span className="text-6xl">🌱</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">나도 몰랐던<br/>나란 사람</h1>
            <p className="text-indigo-100 mb-10 text-sm opacity-90 leading-relaxed">
              경험이 없어서 못 쓰는게 아니라<br/>
              발견하지 못해서 못 쓰는 거예요.<br/>
              AI와 대화하며 당신의 보석을 찾아보세요.
            </p>
            <button
              onClick={() => { audioService.playClick(); changeView('chat'); }}
              className="w-full bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-50 transition transform active:scale-95"
            >
              내 경험 찾으러 가기
            </button>
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        {view !== 'onboarding' && (
          <div className="flex-1 flex flex-col p-4 h-full">
            {view === 'chat' && (
              <ChatInterface 
                history={history} 
                setHistory={setHistory} 
                onAnalyze={handleAnalyze} 
              />
            )}
            
            {view === 'analysis' && (
              <AnalysisView 
                experiences={experiences} 
                isLoading={isProcessing} 
                onNext={handleRecommend}
                onBack={() => changeView('chat')}
              />
            )}

            {view === 'recommendation' && (
              <RecommendationView 
                activities={recommendations} 
                isLoading={isProcessing} 
                onReset={handleReset}
                onBack={() => changeView('analysis')}
              />
            )}
          </div>
        )}

        {/* 하단 진행 상태 표시줄 (심리적 안정감 제공) */}
        {view !== 'onboarding' && (
          <div className="bg-white p-4 border-t border-gray-100 flex justify-center space-x-2">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${view === 'chat' ? 'w-8 bg-indigo-500' : 'w-2 bg-gray-200'}`}></div>
            <div className={`h-1.5 rounded-full transition-all duration-500 ${view === 'analysis' ? 'w-8 bg-indigo-500' : 'w-2 bg-gray-200'}`}></div>
            <div className={`h-1.5 rounded-full transition-all duration-500 ${view === 'recommendation' ? 'w-8 bg-indigo-500' : 'w-2 bg-gray-200'}`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;