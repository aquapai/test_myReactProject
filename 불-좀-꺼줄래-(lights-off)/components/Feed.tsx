import React from 'react';
import { NewsCardData, TruthLabel } from '../types';
import { AlertTriangle, TrendingUp, HelpCircle } from 'lucide-react';

const mockFeed: NewsCardData[] = [
  {
    id: '1',
    title: '"소금물 마시면 면역력 100배 증가" 주장 논란',
    truthLabel: TruthLabel.FALSE,
    haloScore: 92,
    timestamp: '10분 전',
  },
  {
    id: '2',
    title: '정부, 신규 청년 도약 계좌 가이드라인 발표',
    truthLabel: TruthLabel.TRUE,
    haloScore: 12,
    timestamp: '1시간 전',
  },
  {
    id: '3',
    title: '화성에서 고대 문명 유적 발견되었다?',
    truthLabel: TruthLabel.UNVERIFIED,
    haloScore: 88,
    timestamp: '3시간 전',
  },
  {
    id: '4',
    title: 'AI 반도체 주가, 내년 500% 폭등 전망 리포트',
    truthLabel: TruthLabel.MIXED,
    haloScore: 75,
    timestamp: '5시간 전',
  },
  {
    id: '5',
    title: '초전도체 상용화 임박? 학계 반응은 냉담',
    truthLabel: TruthLabel.MIXED,
    haloScore: 60,
    timestamp: '6시간 전',
  },
  {
    id: '6',
    title: '매일 사과 하나면 의사가 필요 없다: 과학적 검증',
    truthLabel: TruthLabel.TRUE,
    haloScore: 40,
    timestamp: '8시간 전',
  }
];

const Feed: React.FC = () => {
  const handleCardClick = () => {
      alert("이건 예시 데이터라구! 홈에서 진짜 분석을 해봐!");
  }

  return (
    <div className="bg-zinc-950 h-full overflow-y-auto pb-20 p-6 text-white hide-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display flex items-center">
          실시간 <span className="text-yellow-400 mx-2 underline decoration-4 underline-offset-2">감시</span> 중
        </h2>
        <div className="flex items-center gap-1 text-xs text-red-500 font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE
        </div>
      </div>
      
      <div className="space-y-4">
        {mockFeed.map((card) => (
          <div 
            key={card.id} 
            onClick={handleCardClick}
            className="bg-zinc-900 border-2 border-zinc-800 rounded-xl p-4 active:scale-[0.98] transition-all hover:border-yellow-500/50 cursor-pointer shadow-[4px_4px_0px_0px_rgba(24,24,27,1)]"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-2 items-center">
                {card.truthLabel === TruthLabel.FALSE && <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded font-black border border-red-700 shadow-sm">거짓</span>}
                {card.truthLabel === TruthLabel.TRUE && <span className="bg-green-500 text-black text-[10px] px-2 py-1 rounded font-black border border-green-700 shadow-sm">사실</span>}
                {card.truthLabel === TruthLabel.MIXED && <span className="bg-orange-500 text-black text-[10px] px-2 py-1 rounded font-black border border-orange-700 shadow-sm">복합</span>}
                {card.truthLabel === TruthLabel.UNVERIFIED && <span className="bg-zinc-700 text-zinc-300 text-[10px] px-2 py-1 rounded font-black">판단보류</span>}
                <span className="text-zinc-500 text-[10px] font-mono">{card.timestamp}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
                <TrendingUp size={12} className={card.haloScore > 50 ? 'text-red-500' : 'text-green-500'} />
                MSG {card.haloScore}%
              </div>
            </div>
            <h3 className="font-bold text-base leading-snug mb-4 line-clamp-2">
              {card.title}
            </h3>
            <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-zinc-800/50">
              <span className="text-xs text-zinc-500 font-medium">🕵️ 42명이 확인 중</span>
              <button className="text-xs text-yellow-400 hover:text-white font-black bg-zinc-800 px-3 py-1 rounded-full transition-colors">결과 보기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;