import React from 'react';
import { Activity } from '../types';
import { audioService } from '../services/audioService';

interface RecommendationViewProps {
  activities: Activity[];
  isLoading: boolean;
  onReset: () => void;
  onBack: () => void;
}

const RecommendationView: React.FC<RecommendationViewProps> = ({ activities, isLoading, onReset, onBack }) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
         <button onClick={() => { audioService.playClick(); onBack(); }} className="text-gray-500 hover:text-gray-800 text-sm font-medium">
          &larr; 뒤로가기
        </button>
        <h2 className="text-xl font-bold text-gray-800">단기 성장 부스터 🚀</h2>
        <div className="w-16"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
        {isLoading ? (
          <div className="text-center mt-20 space-y-4">
            <div className="animate-pulse flex justify-center space-x-2">
                <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
                <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
                <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-gray-500">당신의 성장을 위한 맞춤형 활동을 찾고 있습니다...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">추천할 활동을 불러오지 못했습니다.</div>
        ) : (
          activities.map((act, idx) => (
            <div 
              key={act.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all"
            >
              {/* Decorative accent */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                act.type === 'Lecture' ? 'bg-blue-400' :
                act.type === 'Campaign' ? 'bg-green-400' : 'bg-orange-400'
              }`}></div>

              <div className="flex justify-between items-start mb-2 pl-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                   act.type === 'Lecture' ? 'bg-blue-50 text-blue-600' :
                   act.type === 'Campaign' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {act.type === 'Lecture' ? '온라인 강의' : act.type === 'Campaign' ? '캠페인 참여' : '단기 봉사'}
                </span>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  ⏱️ {act.duration}
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-800 mb-2 pl-2">{act.title}</h3>
              <p className="text-sm text-gray-600 mb-4 pl-2 leading-relaxed">{act.description}</p>
              
              <div className="bg-gray-50 p-3 rounded-lg ml-2">
                <p className="text-xs font-bold text-gray-500 mb-1">🎁 이력서 활용 포인트</p>
                <p className="text-sm text-indigo-600 font-medium">{act.benefit}</p>
              </div>
              
              <button 
                onClick={() => { audioService.playClick(); alert('실제 서비스에서는 해당 활동 페이지로 이동합니다!'); }}
                className="mt-4 w-full border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition ml-1"
              >
                참여하러 가기
              </button>
            </div>
          ))
        )}
      </div>
        
      {!isLoading && (
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent pt-4 pb-2">
            <button
                onClick={() => { audioService.playClick(); onReset(); }}
                className="w-full bg-white text-gray-500 border border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
            >
                처음으로 돌아가기
            </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationView;