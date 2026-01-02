// 이력서 데이터 구조 정의

// 1. 개인 정보 (블라인드 처리될 항목)
export interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  photoUrl: string; // 실제 앱에서는 파일 업로드지만 여기선 placeholder 사용
}

// 2. 전문 정보 (공개될 항목)
export interface ProfessionalInfo {
  education: string; // 학력 (학교명 노출 가능)
  company: string;   // 현/전 직장 (사명 노출 가능)
  role: string;      // 직무
  skills: string[];  // 스킬 목록
  summary: string;   // 핵심 성과 및 자기소개
}

export interface ResumeProfile {
  personal: PersonalInfo;
  professional: ProfessionalInfo;
}

export enum ViewMode {
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW'
}