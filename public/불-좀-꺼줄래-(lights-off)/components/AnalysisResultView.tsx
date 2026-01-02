import React, { useState } from 'react';
import { AnalysisResult, TruthLabel } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, ShieldAlert, AlertOctagon, ExternalLink, Share2, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onBack: () => void;
}

const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ result, onBack }) => {
  const [vote, setVote] = useState<'agree' | 'disagree' | null>(null);

  // Button Handlers
  const handleShare = async () => {
    const shareData = {
      title: '불 좀 꺼줄래? - 팩트체크 결과',
      text: `[${result.truthLabel}] ${result.title}\n후광 지수: ${result.haloScore}%`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      alert('링크가 복사되었습니다!');
    }
  };

  const handleVote = (type: 'agree' | 'disagree') => {
    if (vote === type) {
        setVote(null); // toggle off
        return;
    }
    setVote(type);
    const pointMsg = type === 'agree' ? '+2P 획득!' : '의견이 반영되었습니다.';
    // Simple toast simulation
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full shadow-lg z-50 animate-bounce';
    toast.innerText = pointMsg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleDiscussion = () => {
      alert("토론 스레드 기능은 준비 중입니다.");
  }

  // Determine colors based on Truth Label
  const getLabelColor = (label: TruthLabel) => {
    switch (label) {
      case TruthLabel.TRUE: return 'text-green-500 border-green-500 bg-green-950/30';
      case TruthLabel.FALSE: return 'text-red-500 border-red-500 bg-red-950/30';
      case TruthLabel.MIXED: return 'text-orange-500 border-orange-500 bg-orange-950/30';
      case TruthLabel.UNVERIFIED: return 'text-zinc-400 border-zinc-500 bg-zinc-800/50';
    }
  };

  const getLabelIcon = (label: TruthLabel) => {
      switch (label) {
      case TruthLabel.TRUE: return <ShieldCheck size={20} className="mr-2" />;
      case TruthLabel.FALSE: return <AlertOctagon size={20} className="mr-2" />;
      default: return <ShieldAlert size={20} className="mr-2" />;
    }
  }

  // Halo Chart Data
  const haloData = [
    { name: 'Halo', value: result.haloScore },
    { name: 'Clean', value: 100 - result.haloScore },
  ];
  const haloColor = result.haloScore > 70 ? '#ef4444' : result.haloScore > 40 ? '#f59e0b' : '#22c55e';

  return (
    <div className="h-full bg-zinc-950 text-white overflow-y-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 hide-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-400 hover:text-white text-base font-bold font-display">← 뒤로가기</button>
        <span className="font-black text-yellow-400 text-lg font-display tracking-tight">팩트 분석 리포트</span>
        <button onClick={handleShare} className="text-zinc-400 hover:text-yellow-400 transition-colors"><Share2 size={20} /></button>
      </div>

      <div className="p-6 space-y-8">
        {/* Title & Verdict */}
        <div className="text-center">
          <div className={`inline-flex items-center px-4 py-1.5 rounded-lg border-2 ${getLabelColor(result.truthLabel)} mb-4 font-black text-sm tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transform -rotate-2`}>
            {getLabelIcon(result.truthLabel)}
            {result.truthLabel === 'TRUE' && '사실 검증됨'}
            {result.truthLabel === 'FALSE' && '거짓 판정'}
            {result.truthLabel === 'MIXED' && '일부 사실/거짓'}
            {result.truthLabel === 'UNVERIFIED' && '검증 불가'}
          </div>
          <h2 className="text-2xl font-display leading-snug mb-2 break-keep">{result.title}</h2>
          <p className="text-zinc-500 text-sm font-medium">신뢰도 점수: <span className="text-zinc-300">{result.confidenceScore}점</span></p>
        </div>

        {/* Halo Meter */}
        <div className="bg-zinc-900 rounded-2xl p-6 border-2 border-zinc-800 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <AlertOctagon size={100} />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-base font-black text-white mb-4 bg-zinc-800 px-3 py-1 rounded-full">후광 지수 (Halo Score)</h3>
            
            {/* 
              Recharts Fix: 
              1. Enforce specific pixel height with inline style.
              2. Use width: '100%' with explicit block display.
            */}
            <div style={{ width: '100%', height: '160px', minHeight: '160px' }} className="relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={haloData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={70}
                    startAngle={180}
                    endAngle={0}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell key="halo" fill={haloColor} />
                    <Cell key="clean" fill="#27272a" />
                  </Pie>
                  <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-4xl font-black font-display">
                     {result.haloScore}
                  </text>
                  <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500 text-xs font-bold">
                     / 100
                  </text>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-2 w-full text-center text-xs font-bold text-zinc-400 pointer-events-none">
                {result.haloScore > 70 ? '⚠️ 매우 자극적/왜곡됨' : result.haloScore > 30 ? '⚠️ 다소 자극적' : '✅ 객관적'}
              </div>
            </div>
            
            {/* Halo Factors */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {result.haloFactors.map((factor, idx) => (
                <span key={idx} className="px-2 py-1 bg-zinc-950 text-red-400 text-xs font-bold rounded border border-red-900/50">
                  #{factor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
           <h3 className="text-xl font-display text-white mb-3 flex items-center gap-2">
             <span className="w-2 h-6 bg-yellow-400 skew-x-[-12deg]"></span>
             분석 요약
           </h3>
           <div className="bg-zinc-900/50 p-4 rounded-xl border-l-4 border-yellow-400 text-sm text-zinc-300 leading-relaxed font-medium">
             {result.summary}
           </div>
        </div>

        {/* Key Points */}
        <div>
           <h3 className="text-xl font-display text-white mb-3">팩트체크 상세</h3>
           <ul className="space-y-3">
             {result.keyPoints.map((point, idx) => (
               <li key={idx} className="flex gap-3 text-sm text-zinc-300 items-start">
                 <span className="flex-shrink-0 w-6 h-6 rounded-md bg-zinc-800 text-yellow-400 flex items-center justify-center text-sm font-black border border-zinc-700 shadow-sm">
                   {idx + 1}
                 </span>
                 <span className="mt-0.5 font-medium">{point}</span>
               </li>
             ))}
           </ul>
        </div>

        {/* Sources */}
        {result.sources.length > 0 && (
          <div>
             <h3 className="text-xl font-display text-white mb-3">검증 근거 자료</h3>
             <div className="space-y-2">
               {result.sources.map((source, idx) => (
                 <a 
                   key={idx} 
                   href={source.uri} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="block bg-zinc-900 hover:bg-zinc-800 transition p-3 rounded-lg border border-zinc-800 group active:scale-[0.99]"
                 >
                   <div className="flex justify-between items-start">
                     <span className="text-sm text-blue-400 font-bold line-clamp-1 group-hover:underline decoration-2 underline-offset-2">{source.title}</span>
                     <ExternalLink size={14} className="text-zinc-600 group-hover:text-blue-400 mt-1 shrink-0" />
                   </div>
                   <span className="text-xs text-zinc-600 block mt-1 truncate">{source.uri}</span>
                 </a>
               ))}
             </div>
          </div>
        )}

        {/* Community Action */}
        <div className="pt-6 border-t-2 border-dashed border-zinc-800">
           <p className="text-sm text-center text-zinc-400 mb-4 font-bold">결과에 대해 어떻게 생각하시나요?</p>
           <div className="flex gap-3">
             <button 
                onClick={() => handleVote('agree')}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all active:scale-95 ${
                    vote === 'agree' 
                    ? 'bg-green-500 border-green-400 text-black shadow-[0px_0px_15px_rgba(34,197,94,0.4)]' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-green-500 hover:text-green-500'
                }`}
             >
               <ThumbsUp size={24} className="mb-1" strokeWidth={3} />
               <span className="text-xs font-black">동의함 (+2P)</span>
             </button>
             <button 
                onClick={() => handleVote('disagree')}
                className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all active:scale-95 ${
                    vote === 'disagree' 
                    ? 'bg-red-500 border-red-400 text-white shadow-[0px_0px_15px_rgba(239,68,68,0.4)]' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-red-500 hover:text-red-500'
                }`}
             >
               <ThumbsDown size={24} className="mb-1" strokeWidth={3} />
               <span className="text-xs font-black">반대함</span>
             </button>
           </div>
           <button 
             onClick={handleDiscussion}
             className="w-full mt-4 flex items-center justify-center gap-2 text-zinc-400 text-sm py-3 rounded-xl hover:bg-zinc-900 transition font-bold"
           >
             <MessageSquare size={18} />
             토론장 입장 (댓글 12개)
           </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultView;