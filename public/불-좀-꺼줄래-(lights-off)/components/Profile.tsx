import React from 'react';
import { UserProfile } from '../types';
import { Award, Zap, Activity, Star } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const mockUser: UserProfile = {
  name: "김팩트",
  title: "후광 사냥꾼 골드",
  points: 1250,
  trustIndex: 88,
  historyCount: 42,
  badges: ['first_blood', 'truth_seeker', 'halo_breaker'],
};

const activityData = [
  { day: '월', count: 2 },
  { day: '화', count: 5 },
  { day: '수', count: 3 },
  { day: '목', count: 8 },
  { day: '금', count: 1 },
  { day: '토', count: 0 },
  { day: '일', count: 4 },
];

const Profile: React.FC = () => {
  return (
    <div className="bg-zinc-950 h-full overflow-y-auto pb-20 text-white hide-scrollbar">
      {/* Profile Header Card */}
      <div className="relative bg-yellow-400 p-8 pb-12 rounded-b-[2rem] border-b-4 border-zinc-900 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-black p-1 mb-4 shadow-[0px_0px_0px_4px_rgba(255,255,255,0.3)]">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-4xl animate-[bounce_2s_infinite]">
              🦁
            </div>
          </div>
          <h2 className="text-3xl font-display text-black mb-1">{mockUser.name}</h2>
          <span className="text-black text-xs font-black bg-white/30 px-3 py-1 rounded-full border border-black/10">
            {mockUser.title}
          </span>

          <div className="grid grid-cols-3 gap-4 mt-8 w-full">
            <div className="text-center bg-black/10 p-2 rounded-xl backdrop-blur-sm border border-black/5">
              <p className="text-black/60 text-[10px] font-bold mb-1">내 포인트</p>
              <p className="text-xl font-display text-black">{mockUser.points} P</p>
            </div>
             <div className="text-center bg-black/10 p-2 rounded-xl backdrop-blur-sm border border-black/5">
              <p className="text-black/60 text-[10px] font-bold mb-1">신뢰력</p>
              <p className="text-xl font-display text-black">{mockUser.trustIndex}</p>
            </div>
             <div className="text-center bg-black/10 p-2 rounded-xl backdrop-blur-sm border border-black/5">
              <p className="text-black/60 text-[10px] font-bold mb-1">팩폭 횟수</p>
              <p className="text-xl font-display text-black">{mockUser.historyCount}회</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Activity Chart */}
        <div>
          <h3 className="text-lg font-display mb-4 flex items-center gap-2">
            <Activity size={18} className="text-green-500" />
            이번 주 활약상
          </h3>
          
          {/* 
            Recharts Fix:
            1. Use flex column to ensure proper layout behavior
            2. Force specific height on container
          */}
          <div className="bg-zinc-900 rounded-xl p-4 border-2 border-zinc-800 flex flex-col justify-center" style={{ height: '180px', minHeight: '180px' }}>
             <div style={{ width: '100%', height: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={activityData}>
                   <XAxis dataKey="day" tick={{fill: '#71717a', fontSize: 12, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                   <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#18181b', border: '2px solid #27272a', borderRadius: '8px', color: '#fff', fontWeight: 'bold'}} />
                   <Bar dataKey="count" fill="#facc15" radius={[4, 4, 0, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Badges */}
        <div>
           <h3 className="text-lg font-display mb-4 flex items-center gap-2">
            <Award size={18} className="text-purple-500" />
            획득한 훈장
          </h3>
          <div className="grid grid-cols-3 gap-3">
             <div onClick={() => alert('첫 검증: 처음으로 진실을 마주한 자')} className="aspect-square bg-zinc-900 rounded-xl flex flex-col items-center justify-center border-2 border-zinc-800 hover:border-yellow-500 hover:bg-zinc-800 transition cursor-pointer group active:scale-95">
                <Zap size={32} className="text-zinc-600 group-hover:text-yellow-400 mb-2 transition-colors" />
                <span className="text-[10px] text-zinc-500 font-bold group-hover:text-white">뉴비 탈출</span>
             </div>
             <div onClick={() => alert('팩트 수호자: 거짓 뉴스 10개를 때려잡음')} className="aspect-square bg-zinc-900 rounded-xl flex flex-col items-center justify-center border-2 border-yellow-500/30 hover:border-yellow-500 transition cursor-pointer group active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                <Star size={32} className="text-yellow-400 mb-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] animate-pulse" />
                <span className="text-[10px] text-zinc-300 font-bold group-hover:text-white">팩트 수호자</span>
             </div>
             <div className="aspect-square bg-zinc-900 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 opacity-50">
                <span className="text-[10px] text-zinc-600 font-bold">???</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;