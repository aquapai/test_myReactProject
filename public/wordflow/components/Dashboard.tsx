import React from 'react';
import { WordChunk, AppMode } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen, Upload, BrainCircuit, Award } from 'lucide-react';

interface DashboardProps {
  chunks: WordChunk[];
  setMode: (mode: AppMode) => void;
  setActiveChunk: (chunkId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ chunks, setMode, setActiveChunk }) => {
  const totalWords = chunks.reduce((acc, chunk) => acc + chunk.words.length, 0);
  const learnedWords = chunks.reduce((acc, chunk) => 
    acc + chunk.words.filter(w => w.learned).length, 0
  , 0);

  const progressData = [
    { name: '암기 완료', value: learnedWords },
    { name: '학습 중', value: totalWords - learnedWords },
  ];

  const COLORS = ['#10b981', '#e2e8f0'];

  const handleStartChunk = (chunkId: number) => {
    setActiveChunk(chunkId);
    setMode(AppMode.LEARNING);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-brand-900 mb-2 tracking-tight">WordFlow</h1>
        <p className="text-slate-500 font-medium">흐름을 타면 암기는 저절로 됩니다</p>
      </header>

      {/* Stats Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 pr-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-500" />
            오늘의 학습 현황
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>진행률</span>
              <span className="font-bold text-brand-600">
                {totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                className="bg-brand-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${totalWords > 0 ? (learnedWords / totalWords) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">{learnedWords} / {totalWords} 단어</p>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 h-40 mt-6 md:mt-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actions */}
      {totalWords === 0 ? (
         <div className="text-center py-12 bg-brand-50 rounded-3xl border-2 border-dashed border-brand-200">
            <BookOpen className="w-16 h-16 text-brand-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-800 mb-2">학습할 단어가 없습니다</h3>
            <p className="text-brand-600 mb-6">CSV나 텍스트 파일을 업로드하여 학습을 시작하세요.</p>
            <button 
              onClick={() => setMode(AppMode.UPLOAD)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 font-bold"
            >
              <Upload className="w-5 h-5" />
              단어장 업로드
            </button>
         </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-brand-500" />
            학습 묶음 (Chunks)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chunks.map((chunk, idx) => (
              <button
                key={chunk.id}
                onClick={() => handleStartChunk(chunk.id)}
                className={`group relative p-5 rounded-2xl border text-left transition-all duration-200 hover:shadow-md
                  ${chunk.isCompleted 
                    ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300' 
                    : 'bg-white border-slate-200 hover:border-brand-300'
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full 
                    ${chunk.isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    Bundle {idx + 1}
                  </span>
                  {chunk.isCompleted && <Award className="w-5 h-5 text-emerald-500" />}
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                  {chunk.words[0]?.term} ... {chunk.words[chunk.words.length - 1]?.term}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{chunk.words.length} 단어</p>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-8">
             <button 
              onClick={() => setMode(AppMode.UPLOAD)}
              className="text-slate-400 hover:text-brand-600 text-sm flex items-center gap-1 transition-colors"
            >
              <Upload className="w-4 h-4" />
              새 단어장 추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
