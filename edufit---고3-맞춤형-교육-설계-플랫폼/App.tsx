
import React, { useState, useEffect } from 'react';
import { DiagnosisData, analyzeStudyPattern, getGroundedRecommendations } from './services/gemini.ts';
import { audioService } from './services/audio.ts';

// 시각적 메트릭 컴포넌트 (인지 DNA)
const MetricTile = ({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-3xl shadow-sm border border-slate-100 transition-transform hover:scale-105">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${color} text-white shadow-lg`}>
      <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{label}</div>
    <div className="text-xl font-black text-slate-800">{value}%</div>
  </div>
);

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-8 shadow-inner">
    <div 
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-1000 ease-out" 
      style={{ width: `${(current / total) * 100}%` }}
    />
  </div>
);

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'diagnosis' | 'loading' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeTab, setActiveTab] = useState<'report' | 'search' | 'plan'>('report');
  const [diagnosis, setDiagnosis] = useState<DiagnosisData>({
    wakeTime: '07:30',
    studyHours: 4,
    phoneUsage: 3,
    preference: 'managed',
    recovery: 'high'
  });
  const [result, setResult] = useState<any>(null);
  const [groundedResults, setGroundedResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [goalCommitted, setGoalCommitted] = useState(false);

  const startDiagnosis = () => {
    audioService.playClick();
    setStep('diagnosis');
  };

  const handleNext = async () => {
    audioService.playClick();
    if (currentQuestion < 4) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('loading');
      try {
        const analysis = await analyzeStudyPattern(diagnosis);
        setResult(analysis);
        audioService.playSuccess();
        setStep('result');
      } catch (error) {
        console.error(error);
        setStep('diagnosis');
      }
    }
  };

  const fetchRecommendations = async () => {
    if (groundedResults || isSearching) return;
    setIsSearching(true);
    try {
      const res = await getGroundedRecommendations(result.typeTitle);
      setGroundedResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'search' && result) {
      fetchRecommendations();
    }
  }, [activeTab]);

  const commitGoal = () => {
    if (!goalCommitted) {
      audioService.playCommit();
      setGoalCommitted(true);
    }
  };

  const getUsageTheme = (h: number) => {
    if (h <= 2) return { text: "Peak Focus", color: "bg-emerald-500", icon: "fa-seedling", desc: "인지 에너지 최적 상태" };
    if (h <= 4) return { text: "Balanced", color: "bg-blue-500", icon: "fa-scale-balanced", desc: "주의력 관리 필요" };
    if (h <= 6) return { text: "Distracted", color: "bg-orange-500", icon: "fa-radiation", desc: "도파민 과잉 경계" };
    return { text: "Burnout", color: "bg-rose-500", icon: "fa-fire-extinguisher", desc: "전두엽 기능 저하 위험" };
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased text-slate-900">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 border border-white relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-100 rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-100 rounded-full blur-[80px] opacity-60"></div>

        {step === 'intro' && (
          <div className="text-center space-y-10 py-8 relative z-10 animate-in fade-in zoom-in duration-700">
            <div className="relative inline-block group">
              <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-indigo-200 animate-float">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center border-4 border-white text-white text-sm shadow-lg animate-bounce">
                <i className="fa-solid fa-bolt"></i>
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                EduFit <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-4">AI</span>
              </h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">
                Cognitive Growth Design
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center space-x-4 text-left transition-all hover:bg-white hover:shadow-md">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <div className="text-xs font-bold text-slate-600 leading-tight">심리학 기반 학습 패턴 분석</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center space-x-4 text-left transition-all hover:bg-white hover:shadow-md">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-route"></i>
                </div>
                <div className="text-xs font-bold text-slate-600 leading-tight">실시간 최신 교육 정보 매칭</div>
              </div>
            </div>

            <button 
              onClick={startDiagnosis}
              className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-[2rem] transition-all flex items-center justify-center space-x-3 shadow-2xl shadow-indigo-100 active:scale-95"
            >
              <span>성향 분석 리포트 시작</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}

        {step === 'diagnosis' && (
          <div className="space-y-8 relative z-10">
            <ProgressBar current={currentQuestion + 1} total={5} />
            
            <div className="min-h-[400px] flex flex-col justify-center">
              {currentQuestion === 0 && (
                <div className="animate-pop text-center">
                  <i className="fa-solid fa-cloud-sun text-5xl text-amber-400 mb-6"></i>
                  <h3 className="text-2xl font-black text-slate-800 mb-8">당신의 하루가 시작되는 시간</h3>
                  <div className="bg-indigo-50 p-12 rounded-[3rem] border-4 border-dashed border-indigo-200 inline-block w-full">
                    <input 
                      type="time" 
                      value={diagnosis.wakeTime}
                      onChange={(e) => setDiagnosis({...diagnosis, wakeTime: e.target.value})}
                      className="text-6xl font-black bg-transparent text-indigo-600 outline-none w-full text-center"
                    />
                  </div>
                </div>
              )}
              {currentQuestion === 1 && (
                <div className="animate-pop text-center">
                  <i className="fa-solid fa-stopwatch-20 text-5xl text-blue-500 mb-6"></i>
                  <h3 className="text-2xl font-black text-slate-800 mb-4">하루 평균 순공 시간</h3>
                  <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl mb-6">
                    <div className="text-7xl font-black text-indigo-600 tracking-tighter mb-4">
                      {diagnosis.studyHours}<span className="text-2xl ml-1 text-slate-300 font-bold tracking-normal">h</span>
                    </div>
                    <input 
                      type="range" min="0" max="15" step="1"
                      value={diagnosis.studyHours}
                      onChange={(e) => setDiagnosis({...diagnosis, studyHours: parseInt(e.target.value)})}
                      className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 shadow-inner"
                    />
                  </div>
                </div>
              )}
              {currentQuestion === 2 && (
                <div className="animate-pop">
                  <div className="flex flex-col items-center mb-8">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl text-white shadow-xl mb-4 ${getUsageTheme(diagnosis.phoneUsage).color}`}>
                      <i className={`fa-solid ${getUsageTheme(diagnosis.phoneUsage).icon}`}></i>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">{getUsageTheme(diagnosis.phoneUsage).text}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{getUsageTheme(diagnosis.phoneUsage).desc}</p>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                      <button 
                        key={h}
                        onClick={() => { audioService.playClick(); setDiagnosis({...diagnosis, phoneUsage: h}); }}
                        className={`aspect-square rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center ${diagnosis.phoneUsage === h ? 'border-indigo-600 bg-indigo-600 text-white scale-90 shadow-lg' : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        <span className="text-xl">{h}</span>
                        <span className="text-[10px] opacity-60">h</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentQuestion === 3 && (
                <div className="animate-pop">
                  <h3 className="text-2xl font-black text-slate-800 mb-8 px-1">최고의 효율을 내는 환경은?</h3>
                  <div className="space-y-5">
                    <button 
                      onClick={() => setDiagnosis({...diagnosis, preference: 'self'})}
                      className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center space-x-5 ${diagnosis.preference === 'self' ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-[1.02]' : 'border-slate-50 bg-slate-50 opacity-60'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${diagnosis.preference === 'self' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-300'}`}>
                        <i className="fa-solid fa-user-pen"></i>
                      </div>
                      <div className="text-left">
                        <div className="font-black text-lg text-slate-800">자기주도형</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Independent Explorer</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => setDiagnosis({...diagnosis, preference: 'managed'})}
                      className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center space-x-5 ${diagnosis.preference === 'managed' ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-[1.02]' : 'border-slate-50 bg-slate-50 opacity-60'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${diagnosis.preference === 'managed' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-300'}`}>
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div className="text-left">
                        <div className="font-black text-lg text-slate-800">시스템 관리형</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">System Focused</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              {currentQuestion === 4 && (
                <div className="animate-pop text-center">
                  <h3 className="text-2xl font-black text-slate-800 mb-10">멘탈 회복 탄력성</h3>
                  <div className="flex justify-center space-x-6">
                    <button 
                      onClick={() => setDiagnosis({...diagnosis, recovery: 'high'})}
                      className={`w-36 h-36 rounded-[3rem] border-2 transition-all flex flex-col items-center justify-center space-y-3 ${diagnosis.recovery === 'high' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-2xl scale-110' : 'border-slate-50 bg-slate-50 opacity-40'}`}
                    >
                      <i className="fa-solid fa-battery-full text-4xl"></i>
                      <div className="font-black text-sm">초고속 복구</div>
                    </button>
                    <button 
                      onClick={() => setDiagnosis({...diagnosis, recovery: 'low'})}
                      className={`w-36 h-36 rounded-[3rem] border-2 transition-all flex flex-col items-center justify-center space-y-3 ${diagnosis.recovery === 'low' ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-2xl scale-110' : 'border-slate-50 bg-slate-50 opacity-40'}`}
                    >
                      <i className="fa-solid fa-battery-quarter text-4xl"></i>
                      <div className="font-black text-sm">심층 자가 진단</div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-200 transition-all active:scale-95"
            >
              {currentQuestion === 4 ? '분석 결과 확인하기' : '다음으로'}
            </button>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center py-24 space-y-8 animate-in fade-in duration-1000">
            <div className="relative w-36 h-36 mx-auto">
              <div className="absolute inset-0 bg-indigo-100 rounded-[2.5rem] animate-ping opacity-20"></div>
              <div className="relative w-full h-full bg-white rounded-[2.5rem] border-4 border-indigo-600 flex items-center justify-center shadow-2xl overflow-hidden">
                <i className="fa-solid fa-microchip text-5xl text-indigo-600 animate-pulse"></i>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-indigo-50/50"></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI 인지 프로파일링</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em]">Processing Habit Data...</p>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="flex flex-col h-[680px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 rounded-[2.5rem] p-7 text-white mb-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl">
                <i className="fa-solid fa-dna"></i>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-3 py-1 rounded-full">Cognitive Analysis</div>
                <div className="text-amber-400 text-xs font-black"><i className="fa-solid fa-star mr-1"></i> TOP 1%</div>
              </div>
              <h2 className="text-3xl font-black mb-2 leading-tight">{result.typeTitle}</h2>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">분석 매칭도 {result.matchingScore}%</span>
              </div>
            </div>

            {/* Visual Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <MetricTile label="집중도" value={80 + Math.floor(Math.random()*15)} color="bg-indigo-500" icon="fa-bullseye" />
              <MetricTile label="규칙성" value={diagnosis.studyHours * 6} color="bg-purple-500" icon="fa-arrows-rotate" />
              <MetricTile label="회복력" value={diagnosis.recovery === 'high' ? 95 : 68} color="bg-pink-500" icon="fa-shield-heart" />
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex p-1.5 bg-slate-100 rounded-3xl mb-6 shadow-inner">
              {[
                {id: 'report', label: '분석', icon: 'fa-chart-simple'},
                {id: 'plan', label: '루틴', icon: 'fa-calendar-days'},
                {id: 'search', label: '추천', icon: 'fa-compass'}
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { audioService.playClick(); setActiveTab(tab.id as any); }}
                  className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black flex flex-col items-center justify-center space-y-1 transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-xl scale-105' : 'text-slate-400'}`}
                >
                  <i className={`fa-solid ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-6 pb-6">
              {activeTab === 'report' && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 relative">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg">KEY INSIGHT</div>
                    <p className="text-sm text-slate-700 leading-relaxed font-bold italic">"{result.description}"</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Strategy Cards</h4>
                    {result.strategies.map((s: string, i: number) => (
                      <div key={i} className="flex items-center space-x-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex-shrink-0 flex items-center justify-center text-xl font-black shadow-lg">
                          {i === 0 ? <i className="fa-solid fa-1"></i> : i === 1 ? <i className="fa-solid fa-2"></i> : <i className="fa-solid fa-3"></i>}
                        </div>
                        <p className="text-[13px] text-slate-700 font-bold leading-snug">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="relative pl-8 space-y-10 py-4 before:content-[''] before:absolute before:left-3 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-50 before:rounded-full">
                    {result.schedule.map((item: any, i: number) => (
                      <div key={i} className="relative group">
                        <div className="absolute -left-8 top-1.5 w-7 h-7 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center z-10 shadow-lg transition-transform group-hover:scale-125">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        </div>
                        <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:border-indigo-300 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">{item.time}</span>
                            <i className="fa-solid fa-circle-play text-slate-200 text-xs"></i>
                          </div>
                          <div className="font-black text-slate-800 text-lg mb-2">{item.activity}</div>
                          <div className="text-[11px] text-slate-500 font-bold flex items-center">
                            <i className="fa-solid fa-lightbulb text-amber-400 mr-2"></i> {item.tip}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-7 rounded-[2.5rem] border-2 transition-all ${goalCommitted ? 'bg-emerald-50 border-emerald-200 shadow-emerald-100 shadow-xl' : 'bg-slate-900 border-slate-900 shadow-2xl shadow-slate-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${goalCommitted ? 'bg-emerald-500' : 'bg-white text-slate-900'}`}>
                          <i className={`fa-solid ${goalCommitted ? 'fa-check' : 'fa-hand-pointer'}`}></i>
                        </div>
                        <h4 className={`text-sm font-black uppercase tracking-widest ${goalCommitted ? 'text-emerald-700' : 'text-white'}`}>실행 의도 각인</h4>
                      </div>
                    </div>
                    {!goalCommitted ? (
                      <button 
                        onClick={commitGoal}
                        className="w-full py-4 bg-white text-slate-900 text-xs font-black rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg active:scale-95"
                      >
                        오늘의 플랜 확정하기
                      </button>
                    ) : (
                      <div className="text-center py-2 text-emerald-800 font-black text-sm animate-pulse">
                        READY TO STUDY. 가즈아!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'search' && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {isSearching ? (
                    <div className="py-24 text-center space-y-6">
                      <div className="w-16 h-16 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto shadow-inner"></div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-[0.4em]">Crawling Market Data</p>
                    </div>
                  ) : groundedResults ? (
                    <>
                      <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest">AI Curation Hub</span>
                        </div>
                        <div className="text-[13px] font-bold leading-relaxed whitespace-pre-wrap opacity-95">
                          {groundedResults.text}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Real-time Sources</h4>
                        {groundedResults.sources.map((source: any, i: number) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 hover:scale-[1.03] transition-all shadow-sm hover:shadow-xl group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-500">
                                <i className="fa-solid fa-link text-sm"></i>
                              </div>
                              <span className="text-xs font-black text-slate-700 truncate max-w-[180px]">{source.title}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:border-indigo-500 transition-all">
                              <i className="fa-solid fa-chevron-right text-[10px]"></i>
                            </div>
                          </a>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            <button 
              onClick={() => { audioService.playClick(); setStep('intro'); setCurrentQuestion(0); setGroundedResults(null); setGoalCommitted(false); }}
              className="mt-6 w-full py-4 bg-slate-50 text-slate-400 hover:text-slate-600 font-black rounded-[1.5rem] transition-all text-[10px] uppercase tracking-[0.3em] active:scale-95 border border-slate-100"
            >
              Reset Diagnosis
            </button>
          </div>
        )}

      </div>
      
      <footer className="mt-10 text-center text-slate-400 text-[11px] font-black tracking-[0.5em] uppercase opacity-50">
        <p>Advanced Bio-Cognitive Core v3.1</p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pop { animation: pop 0.5s cubic-bezier(0.17, 0.67, 0.83, 1.2) forwards; }
        @keyframes pop {
          0% { opacity: 0; transform: scale(0.7) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        input[type="range"]::-webkit-slider-thumb {
          width: 24px; height: 24px;
          background: #4F46E5;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid #fff;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
        }
      `}</style>
    </div>
  );
};

export default App;
