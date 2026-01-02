import React, { useEffect } from 'react';
import { Candidate } from '../types';
import { Award, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  candidate: Candidate;
  onNext: () => void;
}

export const BriefingCard: React.FC<Props> = ({ candidate, onNext }) => {
  useEffect(() => {
    audioService.playSuccessSound();
  }, []);

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
      <div className="bg-blue-600 p-6 text-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
        
        <img 
          src={candidate.photoUrl} 
          alt={candidate.name} 
          className="w-24 h-24 rounded-full border-4 border-white mx-auto shadow-lg object-cover"
        />
        <h2 className="text-2xl font-bold text-white mt-4">{candidate.name}</h2>
        <p className="text-blue-100">{candidate.education}</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <GraduationCap className="text-blue-600 w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-500 font-bold uppercase">학력 & 전공</p>
              <p className="text-sm font-semibold text-gray-800">{candidate.major}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Award className="text-blue-600 w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-500 font-bold uppercase">주요 수상</p>
              <p className="text-sm font-semibold text-gray-800">{candidate.summary[1]}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <Briefcase className="text-blue-600 w-6 h-6 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-500 font-bold uppercase">주요 경력</p>
              <p className="text-sm font-semibold text-gray-800">{candidate.summary[0]}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-yellow-800 font-bold text-sm mb-2 flex items-center">
            <span className="bg-yellow-500 w-2 h-2 rounded-full mr-2"></span>
            탐정 노트 (첫인상)
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            "학벌도 좋고, 대기업 경력에 수상 실적까지 완벽해 보입니다.
            능력 있는 인재임이 틀림없어 보입니다... 정말 그럴까요?"
          </p>
        </div>

        <button 
          onClick={() => {
            audioService.playClickSound();
            onNext();
          }}
          className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 group shadow-lg"
        >
          <span>이력서 검증 시작</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};