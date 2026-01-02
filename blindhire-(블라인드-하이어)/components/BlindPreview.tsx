import React from 'react';
import { ResumeProfile } from '../types';
import { ShieldCheck, Building2, GraduationCap, Code } from 'lucide-react';
import { audioService } from '../services/audioService';

interface BlindPreviewProps {
  profile: ResumeProfile;
  onEdit: () => void;
}

const BlindPreview: React.FC<BlindPreviewProps> = ({ profile, onEdit }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-700 animate-fade-in-up">
        
        {/* Header - The Blind Area */}
        <div className="bg-slate-800 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <ShieldCheck size={120} />
          </div>
          
          <div className="relative z-10 flex items-center space-x-6">
            {/* Blurring the Avatar - Visual Feedback of Privacy */}
            <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden border-4 border-slate-600 relative group cursor-not-allowed">
               <img src="https://picsum.photos/200/200" alt="Blind Profile" className="w-full h-full object-cover filter blur-md grayscale opacity-50 transition-all duration-500 group-hover:blur-lg" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldCheck className="text-white opacity-80" size={32} />
               </div>
            </div>
            
            <div>
              {/* Blurring Name and Age */}
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-slate-700 text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-500 select-none blur-sm px-2 rounded">
                   {profile.personal.name || "OOO"}
                </span>
                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  실명/나이 비공개
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-1">{profile.professional.role || "직무 미정"}</h1>
              <p className="text-slate-400 text-sm">
                지원자 ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Body - The Public Merit Area */}
        <div className="p-8 space-y-8">
          
          {/* Section 1: Summary */}
          <section className="bg-gray-50 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Professional Summary</h3>
            <p className="text-gray-800 leading-relaxed text-lg">
              {profile.professional.summary || "작성된 자기소개가 없습니다."}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section 2: Experience & Education */}
            <section>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 border-b pb-2">Experience & Education</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 text-blue-600">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{profile.professional.company || "회사명 미입력"}</h4>
                    <p className="text-gray-500 text-sm">재직 정보 공개</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4 text-purple-600">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{profile.professional.education || "학력 미입력"}</h4>
                    <p className="text-gray-500 text-sm">학력 정보 공개</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Skills */}
            <section>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 border-b pb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {profile.professional.skills.length > 0 ? (
                   profile.professional.skills.map((skill, idx) => (
                     <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium text-sm border border-gray-200 flex items-center">
                       <Code size={12} className="mr-1 text-gray-400" />
                       {skill}
                     </span>
                   ))
                 ) : (
                   <span className="text-gray-400 text-sm">등록된 스킬이 없습니다.</span>
                 )}
              </div>
            </section>
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-gray-50 border-t flex justify-center">
          <button 
            onClick={() => {
              audioService.playClickSound();
              onEdit();
            }}
            className="text-gray-500 hover:text-gray-800 underline text-sm transition-colors"
          >
            이력서 수정하기
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          이 화면은 채용 담당자에게 실제로 보여지는 <span className="font-bold text-gray-700">블라인드 뷰</span>입니다.
        </p>
      </div>
    </div>
  );
};

export default BlindPreview;