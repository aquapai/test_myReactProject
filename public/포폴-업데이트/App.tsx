import React, { useState } from 'react';
import { AppStep, AnalysisResult, RevisedContent } from './types.ts';
import { analyzePortfolio, upgradeSentence } from './services/geminiService.ts';
import HaloChart from './components/HaloChart.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import { Sparkles, ArrowRight, Upload, RotateCcw, CheckCircle2, AlertCircle, Quote, Star, BarChart3, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.LANDING);
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [revisionInput, setRevisionInput] = useState('');
  const [revisedContent, setRevisedContent] = useState<RevisedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError("경력을 설명하는 텍스트를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    setCurrentStep(AppStep.ANALYZING);
    
    try {
      const result = await analyzePortfolio(inputText);
      setAnalysisResult(result);
      setCurrentStep(AppStep.DASHBOARD);
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
      setCurrentStep(AppStep.UPLOAD);
    } finally {
      setLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!revisionInput.trim()) return;
    setLoading(true);
    setRevisedContent(null);
    try {
      const result = await upgradeSentence(revisionInput);
      setRevisedContent(result);
    } catch (err) {
      setError("문장 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Components (Views) ---

  const renderLanding = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden animate-fade-in">
      {/* Background Decor */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pastel-blue/30 rounded-full blur-[60px] animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pastel-purple/30 rounded-full blur-[60px] animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 border border-blue-100 text-slate-500 text-xs font-medium tracking-widest uppercase shadow-sm mb-4 backdrop-blur-sm">
          <Sparkles size={12} className="text-blue-400" />
          <span>Psychology Meets Career</span>
        </div>

        <div className="flex flex-col items-center leading-none select-none">
          <span className="font-serif text-3xl md:text-4xl text-slate-500 font-light tracking-[0.2em] mb-4">
            당신의 커리어,
          </span>
          <span className="font-serif text-4xl md:text-5xl text-slate-700 font-medium tracking-tight mb-2">
             가장 확실한
          </span>
          <h1 className="font-serif text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 tracking-tighter drop-shadow-sm pb-4">
            후광을 입다
          </h1>
        </div>

        <p className="font-sans text-lg text-slate-500 max-w-xl mx-auto leading-relaxed font-light mt-8">
          심리학적 <b>‘후광 효과(Halo Effect)’</b>를 당신의 이력서에 입히세요.<br className="hidden md:block"/>
          무의식을 자극하는 권위와 숫자로 증명해드립니다.
        </p>

        <div className="pt-10">
          <button 
            onClick={() => setCurrentStep(AppStep.UPLOAD)}
            className="group relative px-12 py-5 bg-slate-800 text-white font-medium text-lg rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative flex items-center gap-3 font-serif">
              진단 시작하기 <ArrowRight size={18} className="text-blue-200" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="max-w-4xl mx-auto pt-28 px-6 min-h-screen flex flex-col animate-slide-up">
      <div className="mb-12 text-center space-y-4">
        <h2 className="font-serif text-4xl font-medium text-slate-800">당신의 이야기</h2>
        <p className="font-sans text-slate-500 font-light">
          그동안 쌓아온 노력과 경험이 담긴 이력서나 포트폴리오 텍스트를 입력해주세요.<br/>
          숨겨져 있던 당신의 빛을 찾아드리겠습니다.
        </p>
      </div>
      
      <div className="flex-grow flex flex-col gap-6 relative">
        <div className="glass-card rounded-[2rem] p-2 relative group transition-all duration-500 hover:shadow-2xl">
          <div className="bg-white/50 rounded-[1.8rem] p-6 h-full">
            <textarea
              className="w-full h-[400px] p-4 bg-transparent border-none rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none resize-none text-lg leading-relaxed font-sans font-light"
              placeholder="이곳에 텍스트를 붙여넣으세요..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          {/* Subtle Icon */}
          <div className="absolute bottom-8 right-8 pointer-events-none opacity-10">
            <Upload className="text-slate-800 w-20 h-20" />
          </div>
        </div>
        
        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 py-3 rounded-2xl border border-red-100 shadow-sm">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6 mb-20">
           <button 
            onClick={() => setCurrentStep(AppStep.LANDING)}
            className="px-6 py-3 text-slate-400 hover:text-slate-600 transition-colors font-medium flex items-center gap-2 text-sm"
          >
            <RotateCcw size={14} /> 뒤로가기
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={!inputText.trim()}
            className="px-10 py-4 bg-gradient-to-r from-pastel-blue to-indigo-300 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center gap-2"
          >
            {loading ? '분석 중...' : '후광 지수 분석하기'} <Sparkles size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 bg-blue-100/50 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
           <Sparkles className="text-pastel-blue w-10 h-10" />
        </div>
      </div>
      <h2 className="font-serif text-3xl text-slate-800 mb-4 animate-fade-in font-medium">분석 중입니다...</h2>
      <p className="font-sans text-slate-500 max-w-sm font-light animate-fade-in delay-100 leading-relaxed">
        권위, 숫자, 그리고 매력을 심리학적 관점에서 분석하고 있습니다.
      </p>
    </div>
  );

  const renderDashboard = () => {
    if (!analysisResult) return null;

    return (
      <div className="max-w-6xl mx-auto pt-20 px-6 pb-24 animate-slide-up">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-bold tracking-widest text-[10px] uppercase mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Analysis Report
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-slate-800 font-medium">후광 지수 (Halo Score)</h2>
          </div>
          <button 
            onClick={() => setCurrentStep(AppStep.LANDING)}
            className="text-sm text-slate-400 hover:text-slate-600 px-5 py-2 rounded-full border border-slate-200 hover:bg-white transition-all bg-white/50"
          >
            다시 시작
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Chart Section */}
          <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden bg-white/60">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-pastel-blue/20 blur-[60px] rounded-full pointer-events-none"></div>
             
             <div className="w-full mb-8 z-10">
               <HaloChart score={analysisResult.haloScore} />
             </div>
             
             {/* Score Breakdown Mini Cards */}
             <div className="grid grid-cols-3 gap-3 w-full">
                <div className="text-center p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <span className="block text-indigo-400 font-serif text-2xl mb-1">{analysisResult.haloScore.authority}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">권위</span>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <span className="block text-blue-400 font-serif text-2xl mb-1">{analysisResult.haloScore.numbers}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">수치</span>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                  <span className="block text-purple-400 font-serif text-2xl mb-1">{analysisResult.haloScore.visualImpact}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">임팩트</span>
                </div>
             </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="glass-card rounded-[2.5rem] p-10 flex-grow bg-white/60 relative overflow-hidden">
              <Quote className="absolute top-8 right-8 text-slate-100 w-16 h-16 rotate-180" />
              <h3 className="font-serif text-2xl text-slate-800 mb-6">종합 진단</h3>
              <p className="font-sans text-slate-600 leading-8 text-lg font-light whitespace-pre-wrap">
                {analysisResult.overallSummary}
              </p>
            </div>
            
            <button 
              onClick={() => setCurrentStep(AppStep.REVISION)}
              className="w-full py-6 bg-slate-800 text-white rounded-[2rem] font-medium text-lg shadow-xl hover:shadow-2xl hover:bg-slate-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group"
            >
              <span>지금 '후광 효과' 입히기</span>
              <Wand2 size={20} className="text-pastel-blue group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feedback Grid */}
        <div className="mb-8 pl-2 border-l-4 border-pastel-blue/50">
           <h3 className="font-serif text-2xl text-slate-800">상세 피드백</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysisResult.feedback.map((item, idx) => (
            <div key={idx} className="glass-card-hover bg-white rounded-3xl p-8 border border-white shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.category === 'Authority' ? 'bg-indigo-50 text-indigo-500' :
                  item.category === 'Numbers' ? 'bg-blue-50 text-blue-500' :
                  'bg-purple-50 text-purple-500'
                }`}>
                  {item.category === 'Authority' && <Star size={14} fill="currentColor" />}
                  {item.category === 'Numbers' && <BarChart3 size={14} />}
                  {item.category === 'Visual' && <Sparkles size={14} />}
                </span>
                <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                  {item.category === 'Authority' ? '권위' : item.category === 'Numbers' ? '수치' : '임팩트'}
                </span>
              </div>
              <h4 className="text-slate-800 font-medium mb-3 text-lg leading-snug">{item.issue}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-light bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRevision = () => (
    <div className="max-w-5xl mx-auto pt-20 px-6 pb-24 animate-slide-up">
      <header className="flex justify-between items-center mb-16">
        <button 
          onClick={() => setCurrentStep(AppStep.DASHBOARD)}
          className="flex items-center gap-3 text-slate-400 hover:text-slate-600 transition-colors group px-4 py-2 rounded-full hover:bg-white/50"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-slate-300 transition-colors">
             <ArrowRight size={14} className="rotate-180 text-slate-600" />
          </div>
          <span className="text-sm font-medium">뒤로가기</span>
        </button>
        <h2 className="font-serif text-3xl font-medium text-slate-800">
          문장 업그레이드
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Input */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-[2.5rem] p-8 bg-white/70">
            <h3 className="font-serif text-xl text-slate-800 mb-2">문장 다듬기</h3>
            <p className="text-sm text-slate-500 font-light mb-6">
              밋밋한 문장을 입력하세요. <b>권위, 수치, 임팩트</b>를 더해 다시 써드립니다.
            </p>
            
            <div className="relative">
              <textarea
                className="w-full h-40 p-6 bg-white border border-slate-100 rounded-3xl text-slate-700 placeholder-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-50 transition-all resize-none text-base leading-relaxed shadow-inner"
                placeholder="예: 마케팅 업무를 보조했습니다."
                value={revisionInput}
                onChange={(e) => setRevisionInput(e.target.value)}
              />
            </div>
            
            <button
              onClick={handleRewrite}
              disabled={loading || !revisionInput.trim()}
              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : (
                <>
                  <Wand2 size={18} /> 후광 효과 적용하기
                </>
              )}
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 border-slate-100 bg-blue-50/30">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Star size={12} fill="currentColor" /> 작성 팁
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-slate-600 font-light">
                <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-800 font-medium">권위 빌리기:</strong> 유명 기업, 툴, 논문을 인용하여 신뢰를 높이세요.</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-600 font-light">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span><strong className="text-slate-800 font-medium">수치화:</strong> '많이' 대신 '150% 성장'처럼 구체적으로 표현하세요.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col h-full">
           {revisedContent ? (
             <div className="relative h-full animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 blur-[50px] rounded-[3rem] -z-10 opacity-70"></div>
                
                <div className="glass-card rounded-[2.5rem] p-10 bg-white/80 h-full flex flex-col relative border-white shadow-xl">
                   <div className="mb-10 pl-5 border-l-2 border-slate-200">
                     <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2 block">원본</span>
                     <p className="text-slate-500 italic font-light text-lg">"{revisedContent.original}"</p>
                   </div>
                   
                   <div className="mb-10 flex-grow">
                     <span className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-[10px] uppercase tracking-widest font-bold mb-5 shadow-md">
                       <Sparkles size={10} /> 후광 효과 적용됨
                     </span>
                     <p className="font-serif text-2xl md:text-3xl text-slate-800 font-medium leading-snug">
                       "{revisedContent.revised}"
                     </p>
                   </div>

                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold block mb-3">적용된 심리학적 원리</span>
                     <p className="text-sm text-slate-600 leading-relaxed font-light">
                       {revisedContent.explanation}
                     </p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[400px] glass-card rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8 bg-white/30">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <Wand2 className="text-slate-300 w-8 h-8" />
               </div>
               <p className="text-slate-400 text-lg font-light">
                 왼쪽에 문장을 입력하고<br/>마법 같은 변화를 확인하세요.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 selection:bg-blue-200 selection:text-slate-800 overflow-x-hidden font-sans">
      {/* Global animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px] animate-float"></div>
         <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-100/40 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }}></div>
         <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10">
        {currentStep === AppStep.LANDING && renderLanding()}
        {currentStep === AppStep.UPLOAD && renderUpload()}
        {currentStep === AppStep.ANALYZING && renderAnalyzing()}
        {currentStep === AppStep.DASHBOARD && renderDashboard()}
        {currentStep === AppStep.REVISION && renderRevision()}
      </div>
    </div>
  );
};

export default App;