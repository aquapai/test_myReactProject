import React from 'react';
import { Experience } from '../types';
import { audioService } from '../services/audioService';

interface AnalysisViewProps {
  experiences: Experience[];
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ experiences, isLoading, onNext, onBack }) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => { audioService.playClick(); onBack(); }} className="text-gray-500 hover:text-gray-800 text-sm font-medium">
          &larr; 뒤로가기
        </button>
        <h2 className="text-xl font-bold text-gray-800">나의 숨겨진 경력 카드</h2>
        <div className="w-16"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-20">
        {isLoading ? (
          <div className="text-center mt-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500">대화 내용을 분석하여 경력을 정리 중입니다...</p>
            <p className="text-xs text-gray-400">AI가 당신의 강점을 찾고 있어요!</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <p>분석된 경력이 없습니다.</p>
            <p className="text-sm">대화를 조금 더 나누어 볼까요?</p>
          </div>
        ) : (
          experiences.map((exp, idx) => (
            <div 
              key={exp.id} 
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-indigo-700">{exp.title}</h3>
                <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-md font-semibold">STAR 완료</span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-2">
                  <span className="font-bold min-w-[30px] text-gray-400">S</span>
                  <p className="bg-gray-50 p-2 rounded flex-1">{exp.situation}</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold min-w-[30px] text-gray-400">T</span>
                  <p className="bg-gray-50 p-2 rounded flex-1">{exp.task}</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold min-w-[30px] text-gray-400">A</span>
                  <p className="bg-gray-50 p-2 rounded flex-1">{exp.action}</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold min-w-[30px] text-indigo-500">R</span>
                  <p className="bg-indigo-50 p-2 rounded flex-1 font-medium text-gray-800">{exp.result}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {exp.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {!isLoading && experiences.length > 0 && (
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-transparent pt-4 pb-2">
            <button
            onClick={() => { audioService.playClick(); onNext(); }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95 flex items-center justify-center gap-2"
            >
            <span>이 경험을 보완할 활동 추천받기</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;