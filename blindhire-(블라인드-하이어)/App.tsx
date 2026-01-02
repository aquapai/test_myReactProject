import React, { useState } from 'react';
import { ViewMode, ResumeProfile } from './types.ts';
import ResumeEditor from './components/ResumeEditor.tsx';
import BlindPreview from './components/BlindPreview.tsx';
import { audioService } from './services/audioService.ts';

const initialProfile: ResumeProfile = {
  personal: {
    name: '',
    age: '',
    gender: '',
    photoUrl: '',
  },
  professional: {
    education: '',
    company: '',
    role: '',
    skills: [],
    summary: '',
  }
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EDIT);
  const [profile, setProfile] = useState<ResumeProfile>(initialProfile);

  const switchToPreview = () => {
    setViewMode(ViewMode.PREVIEW);
    audioService.playSwitchSound(); // 모드 전환 시 청각적 피드백 제공
  };

  const switchToEdit = () => {
    setViewMode(ViewMode.EDIT);
    audioService.playSwitchSound();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-blue-100">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
            <span className="font-bold text-xl tracking-tight">BlindHire</span>
          </div>
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={switchToEdit}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === ViewMode.EDIT 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              작성하기
            </button>
            <button
              onClick={switchToPreview}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === ViewMode.PREVIEW 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              미리보기
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* 인지 심리학: 사용자에게 현재 상태를 명확히 인지시킴 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {viewMode === ViewMode.EDIT ? "나의 역량을 증명하세요" : "편견 없는 당신의 모습"}
          </h1>
          <p className="text-gray-500">
            {viewMode === ViewMode.EDIT 
              ? "개인정보는 블라인드 처리되고, 오직 당신의 실력만 기록됩니다." 
              : "채용 담당자는 지금 이 화면을 보게 됩니다. 후광 효과 없이 오직 실력으로."}
          </p>
        </div>

        {viewMode === ViewMode.EDIT ? (
          <ResumeEditor 
            profile={profile} 
            setProfile={setProfile} 
            onComplete={switchToPreview} 
          />
        ) : (
          <BlindPreview 
            profile={profile} 
            onEdit={switchToEdit} 
          />
        )}
      </main>

      {/* Result Summary for the User Request */}
      <footer className="max-w-3xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-sm text-sm text-gray-600 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-2">#Result 결과 보고서</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-600">1. 구현한 내용 (기능과 UX/UI)</h4>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-xs">
              <li><strong>이력서 에디터 (Chunking):</strong> 비공개(Private) 영역과 공개(Public) 영역을 시각적으로 분리하여 정보 입력 시 혼란 방지.</li>
              <li><strong>블라인드 프리뷰 (Isolation Effect):</strong> 이름/사진을 Blur 처리하고 역량(Skill, 경력)을 강조하여 채용 담당자의 시선을 핵심 정보로 유도.</li>
              <li><strong>AI 자기소개 최적화 (Gemini):</strong> AI를 활용해 실무 역량 중심의 표현으로 다듬어주며, 실수로 포함된 개인정보 제거.</li>
              <li><strong>청각 피드백 (Web Audio):</strong> 버튼 클릭 및 모드 전환 시 부드러운 효과음을 제공하여 작업 완료의 성취감 부여.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-blue-600">2. 다음에 만드려는 것 3가지 제안</h4>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-xs">
              <li><strong>역량 인증 뱃지 시스템:</strong> 깃허브/포트폴리오를 AI가 분석해 '검증된 스킬' 뱃지 부여 (신뢰도 상승).</li>
              <li><strong>기업용 매칭 대시보드:</strong> 기업이 원하는 스킬 키워드와 매칭되는 익명 인재를 카드 형태로 추천.</li>
              <li><strong>모의 화상 면접 (AI Avatar):</strong> 본인 얼굴 대신 아바타를 사용하여 목소리와 내용만으로 진행하는 비대면 면접 기능.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-blue-600">3. 구현 의도와 인지 심리학적 원리</h4>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-xs">
              <li><strong>Chunking (청킹):</strong> 정보를 '개인정보'와 '역량정보' 두 덩어리로 나누어 사용자의 인지 부하(Cognitive Load)를 줄임.</li>
              <li><strong>Von Restorff Effect (고립 효과):</strong> 프리뷰에서 사진을 흐리게(Blur) 하고 직무명을 굵게 표시해, 중요한 정보(직무)가 더 기억에 남도록 설계.</li>
              <li><strong>Feedback Loop (피드백):</strong> 저장 시 긍정적인 화음(Major Chord)을 재생하여 사용자의 행동에 대한 즉각적인 보상 제공.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-blue-600">4. 코딩 개념 설명</h4>
            <ol className="list-decimal list-inside space-y-1 mt-1 text-xs">
              <li><strong>State Lifting (상태 끌어올리기):</strong> 이력서 데이터(`profile`)를 `App.tsx`에서 관리하여 에디터와 프리뷰가 데이터를 공유하도록 함.</li>
              <li><strong>Web Audio API:</strong> 브라우저에서 소리를 직접 합성하는 기술. MP3 파일 없이 코드로 주파수(Hz)를 조절해 효과음 생성.</li>
              <li><strong>Tailwind CSS Utility First:</strong> 별도 CSS 파일 없이 클래스 이름만으로 디자인하여 개발 속도를 높이고 일관성 유지.</li>
            </ol>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;