import React from 'react';
import { QuizCategory, HistoryItem } from '../types';
import { Button } from './ui/Button.tsx';
import { audioService } from '../services/audioService';
import { 
  Zap, 
  BookOpen, 
  Rocket, 
  Box, 
  RotateCcw, 
  History, 
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  history: HistoryItem[];
  onSelectCategory: (category: QuizCategory) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ history, onSelectCategory }) => {
  
  const categories = [
    { id: QuizCategory.DAILY, icon: Zap, color: 'bg-yellow-500', desc: '매일 새로운 두뇌 자극', label: '오늘의 챌린지' },
    { id: QuizCategory.BUSINESS, icon: BookOpen, color: 'bg-blue-500', desc: '공부 루틴을 깨는 발상', label: '학업/수능' },
    { id: QuizCategory.FUTURE, icon: Rocket, color: 'bg-purple-500', desc: '10년 뒤 나는 무엇을 할까?', label: '미래 상상' },
    { id: QuizCategory.OBJECT, icon: Box, color: 'bg-orange-500', desc: '주변 사물의 새로운 용도', label: '사물 재발견' },
    { id: QuizCategory.REVERSE, icon: RotateCcw, color: 'bg-pink-500', desc: '문제를 거꾸로 뒤집어보자', label: '역발상' },
  ];

  const handleCategoryClick = (category: QuizCategory) => {
    audioService.playClick();
    onSelectCategory(category);
  };

  // Prepare chart data from history (last 7 attempts)
  const chartData = history.slice(-7).map((item, idx) => ({
    name: idx + 1,
    score: item.analysis.totalScore
  }));

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.analysis.totalScore, 0) / history.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      
      {/* Hero Section */}
      <div className="mb-10 text-center pt-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Brain<span className="text-indigo-600">Break</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
          정답은 하나가 아닙니다.<br/>
          굳어버린 머리를 깨우는 하루 5분 창의력 스트레칭.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats & History */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              나의 창의력 지수
            </h3>
            {history.length > 0 ? (
               <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis hide />
                     <YAxis hide domain={[0, 100]} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                     />
                     <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                   </LineChart>
                 </ResponsiveContainer>
                 <div className="mt-2 flex justify-between text-sm text-slate-500">
                    <span>평균 점수: <span className="font-bold text-slate-800">{averageScore}</span></span>
                    <span>푼 문제: <span className="font-bold text-slate-800">{history.length}</span></span>
                 </div>
               </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl p-4 text-center">
                <p>아직 데이터가 없어요.</p>
                <p>첫 퀴즈를 풀어보세요!</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-400" />
              최근 나의 생각들
            </h3>
            <div className="space-y-4">
              {history.slice().reverse().slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-default border border-transparent hover:border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                      {item.quiz.category}
                    </span>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2 font-medium">"{item.userAnswer}"</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.analysis.totalScore}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{item.analysis.totalScore}</span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-4">창의적인 여정을 시작해보세요.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Categories */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured Daily Challenge Card - Spans 2 cols on MD */}
            <button 
              onClick={() => handleCategoryClick(QuizCategory.DAILY)}
              className="md:col-span-2 group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-left shadow-lg shadow-indigo-200 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl w-fit mb-6">
                    <Zap className="w-8 h-8 text-yellow-300" />
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">추천</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{QuizCategory.DAILY}</h2>
                <p className="text-indigo-100 max-w-md mb-6 font-medium">매일 아침, 뇌를 깨우는 5분. 논리의 법칙을 깨는 새로운 문제.</p>
                <div className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm group-hover:bg-indigo-50 transition-colors">
                  시작하기 <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Other Categories */}
            {categories.filter(c => c.id !== QuizCategory.DAILY).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="group bg-white hover:bg-slate-50 border border-slate-100 p-6 rounded-3xl text-left transition-all hover:shadow-md hover:border-slate-200 active:scale-[0.98]"
              >
                <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{cat.label}</h3>
                <p className="text-sm text-slate-500 leading-snug break-keep">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};