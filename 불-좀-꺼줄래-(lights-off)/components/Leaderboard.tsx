import React from 'react';
import { LeaderboardEntry } from '../types';

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: '팩트체커_01', title: '후광 사냥꾼 마스터', points: 4520, avatarColor: 'bg-red-500' },
  { rank: 2, name: '진실의입', title: '후광 사냥꾼 플래티넘', points: 3890, avatarColor: 'bg-blue-500' },
  { rank: 3, name: '뉴스감별사', title: '후광 사냥꾼 골드', points: 3100, avatarColor: 'bg-green-500' },
  { rank: 4, name: '김팩트 (나)', title: '후광 사냥꾼 골드', points: 1250, avatarColor: 'bg-yellow-500' },
  { rank: 5, name: '정보보호', title: '후광 사냥꾼 실버', points: 980, avatarColor: 'bg-purple-500' },
  { rank: 6, name: '클린인터넷', title: '후광 사냥꾼 실버', points: 950, avatarColor: 'bg-indigo-500' },
  { rank: 7, name: '팩트폭격기', title: '후광 사냥꾼 브론즈', points: 800, avatarColor: 'bg-pink-500' },
  { rank: 8, name: '진실탐사', title: '후광 사냥꾼 브론즈', points: 750, avatarColor: 'bg-orange-500' },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-zinc-950 h-full overflow-y-auto pb-20 p-6 text-white hide-scrollbar">
      <h2 className="text-2xl font-bold mb-6 font-display">명예의 전당</h2>
      
      {/* Top 3 Podium (Simplified visualization) */}
      <div className="flex items-end justify-center gap-4 mb-10 mt-4">
        {/* Rank 2 */}
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 mb-2 overflow-hidden shadow-lg">
             <div className="w-full h-full bg-blue-500"></div>
           </div>
           <div className="w-20 h-24 bg-zinc-800 rounded-t-lg flex flex-col items-center justify-start pt-2 border-t border-x border-zinc-700">
             <span className="font-bold text-2xl text-zinc-400 font-display">2</span>
             <span className="text-[10px] text-zinc-500 mt-1">{mockLeaderboard[1].name}</span>
           </div>
        </div>
        {/* Rank 1 */}
        <div className="flex flex-col items-center z-10">
           <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-yellow-500 mb-2 overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <div className="w-full h-full bg-red-500"></div>
           </div>
           <div className="w-24 h-32 bg-gradient-to-b from-yellow-500/20 to-zinc-800 rounded-t-lg flex flex-col items-center justify-start pt-2 border-t border-x border-yellow-500/50">
             <span className="font-bold text-3xl text-yellow-400 font-display">1</span>
             <span className="text-xs text-yellow-100 mt-1 font-bold">{mockLeaderboard[0].name}</span>
           </div>
        </div>
        {/* Rank 3 */}
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 mb-2 overflow-hidden shadow-lg">
             <div className="w-full h-full bg-green-500"></div>
           </div>
           <div className="w-20 h-16 bg-zinc-800 rounded-t-lg flex flex-col items-center justify-start pt-2 border-t border-x border-zinc-700">
             <span className="font-bold text-xl text-zinc-500 font-display">3</span>
             <span className="text-[10px] text-zinc-500 mt-1">{mockLeaderboard[2].name}</span>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        {mockLeaderboard.slice(3).map((entry) => (
          <div key={entry.rank} className={`flex items-center p-3 rounded-xl border ${entry.rank === 4 ? 'bg-yellow-900/10 border-yellow-500/50' : 'bg-zinc-900 border-zinc-800'}`}>
            <span className="w-8 text-center font-bold text-zinc-500 font-display">{entry.rank}</span>
            <div className={`w-8 h-8 rounded-full ${entry.avatarColor} mx-3`}></div>
            <div className="flex-1">
               <h4 className={`text-sm font-bold ${entry.rank === 4 ? 'text-yellow-400' : 'text-white'}`}>
                 {entry.name} {entry.rank === 4 && '(나)'}
               </h4>
               <p className="text-[10px] text-zinc-500">{entry.title}</p>
            </div>
            <span className="font-mono text-sm text-zinc-300 font-bold">{entry.points.toLocaleString()} P</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;