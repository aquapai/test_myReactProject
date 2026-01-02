import React, { useState } from 'react';
import { ResumeProfile } from '../types';
import { Sparkles, Save } from 'lucide-react';
import { audioService } from '../services/audioService';
import { enhanceResumeSummary } from '../services/geminiService';
import InfoTooltip from './InfoTooltip.tsx';

interface ResumeEditorProps {
  profile: ResumeProfile;
  setProfile: React.Dispatch<React.SetStateAction<ResumeProfile>>;
  onComplete: () => void;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ profile, setProfile, onComplete }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({
      ...prev,
      personal: { ...prev.personal, [e.target.name]: e.target.value }
    }));
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      professional: { ...prev.professional, [e.target.name]: e.target.value }
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setProfile(prev => ({
      ...prev,
      professional: { ...prev.professional, skills }
    }));
  };

  const handleAIEnhance = async () => {
    audioService.playClickSound();
    if (!profile.professional.summary) return;
    
    setIsEnhancing(true);
    const enhanced = await enhanceResumeSummary(profile.professional.summary, profile.professional.role);
    setProfile(prev => ({
      ...prev,
      professional: { ...prev.professional, summary: enhanced }
    }));
    setIsEnhancing(false);
    audioService.playSuccessSound();
  };

  const handleSubmit = () => {
    audioService.playSuccessSound();
    onComplete();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl transition-all duration-500">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        이력서 작성
        <span className="text-sm font-normal text-gray-500 ml-4">
          블라인드 정보와 공개 정보를 구분해 입력하세요.
        </span>
      </h2>

      {/* Chunking: Grouping Private Info separately */}
      <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 relative">
        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
          🔒 비공개 개인정보
          <InfoTooltip text="이 정보는 기업에게 블라인드 처리되어 보이지 않습니다." />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              type="text"
              name="name"
              value={profile.personal.name}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none transition-all"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
            <input
              type="text"
              name="age"
              value={profile.personal.age}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none transition-all"
              placeholder="25세"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
            <input
              type="text"
              name="gender"
              value={profile.personal.gender}
              onChange={handlePersonalChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none transition-all"
              placeholder="남성/여성/무관"
            />
          </div>
        </div>
        <div className="absolute top-2 right-2 text-xs text-red-400 font-bold bg-white px-2 py-1 rounded-full shadow-sm">
          BLIND AREA
        </div>
      </div>

      {/* Chunking: Grouping Public Info separately */}
      {/* Isolation Effect: Distinctive color for important section */}
      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 relative">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          📢 공개 역량 정보
          <InfoTooltip text="기업이 평가하는 핵심 정보입니다. 최대한 상세히 적어주세요." />
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">희망 직무</label>
              <input
                type="text"
                name="role"
                value={profile.professional.role}
                onChange={handleProfessionalChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="프론트엔드 개발자"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학력 (학교명 공개 가능)</label>
              <input
                type="text"
                name="education"
                value={profile.professional.education}
                onChange={handleProfessionalChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="한국대학교 컴퓨터공학과"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">재직 회사 / 경력</label>
            <input
              type="text"
              name="company"
              value={profile.professional.company}
              onChange={handleProfessionalChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="(주)넥스트레벨 (3년)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">보유 스킬 (쉼표로 구분)</label>
            <input
              type="text"
              value={profile.professional.skills.join(', ')}
              onChange={handleSkillsChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="React, TypeScript, Tailwind CSS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
              <span>핵심 성과 및 소개</span>
              <button 
                onClick={handleAIEnhance}
                disabled={isEnhancing}
                className="text-xs flex items-center text-purple-600 hover:text-purple-800 font-bold transition-colors disabled:opacity-50"
              >
                <Sparkles size={14} className="mr-1" />
                {isEnhancing ? "AI 생각 중..." : "AI로 다듬기"}
              </button>
            </label>
            <textarea
              name="summary"
              value={profile.professional.summary}
              onChange={handleProfessionalChange}
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              placeholder="본인의 성과를 중심으로 작성해주세요."
            />
          </div>
        </div>
        <div className="absolute top-2 right-2 text-xs text-blue-500 font-bold bg-white px-2 py-1 rounded-full shadow-sm">
          PUBLIC AREA
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
        >
          <Save size={18} className="mr-2" />
          저장하고 프리뷰 보기
        </button>
      </div>
    </div>
  );
};

export default ResumeEditor;