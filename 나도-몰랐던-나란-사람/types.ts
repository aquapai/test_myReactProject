// 채팅 메시지 타입
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// 발굴된 경험 (STAR 기법)
export interface Experience {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
}

// 추천 활동
export interface Activity {
  id: string;
  title: string;
  type: 'Lecture' | 'Campaign' | 'Volunteering'; // 강의, 캠페인, 봉사
  duration: string; // 예: "3일 완성"
  description: string;
  benefit: string; // 이력서에 쓸 수 있는 포인트
}

// 화면 상태
export type ViewState = 'onboarding' | 'chat' | 'analysis' | 'recommendation';