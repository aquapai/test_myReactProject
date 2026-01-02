import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, Experience, Activity } from "../types";

// API 키가 없으면 에러 처리를 우아하게 하기 위한 안전장치
const apiKey = process.env.API_KEY || '';

// 인스턴스 생성 함수
const getAI = () => new GoogleGenAI({ apiKey });

// 1. 경험 발굴 채팅 시스템
// 사용자의 사소한 이야기도 경력으로 연결될 수 있게 유도하는 페르소나
const SYSTEM_INSTRUCTION_CHAT = `
당신은 '나도 몰랐던 나란 사람' 서비스의 AI 커리어 상담사입니다. 
주 사용자는 고등학생, 대학생, 취준생입니다.
목표: 사용자가 "쓸 만한 경험이 없다"고 느낄 때, 대화를 통해 숨겨진 역량이나 경험을 찾아내세요.
어조: 친절하고, 격려하며, 호기심이 많습니다. 질문은 한 번에 하나씩만 하세요.
역할:
1. 사용자의 일상적인 활동(알바, 동아리, 게임, 취미 등)에 대해 물어보세요.
2. 그 활동에서 어떤 문제를 해결했는지, 어떤 역할을 했는지 구체적으로 파고드세요.
3. 칭찬을 많이 해주세요. "와, 그건 정말 대단한 리더십인데요?" 같이 반응하세요.
절대 이력서 양식을 직접 작성해주지 말고, 대화를 통해 '재료'를 모으는 데 집중하세요.
`;

export const sendChatMessage = async (history: Message[], newMessage: string): Promise<string> => {
  if (!apiKey) return "API 키가 설정되지 않았습니다.";
  
  try {
    const ai = getAI();
    // 이전 대화 내용을 컨텍스트로 변환
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
        thinkingConfig: { thinkingBudget: 0 } // 빠른 응답을 위해 thinking 끔
      },
      history: chatHistory
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "죄송해요, 잠시 생각이 엉켰어요. 다시 말씀해 주시겠어요?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

// 2. 경력 재해석 (Analysis)
// 대화 기록을 바탕으로 STAR 기법으로 정리된 JSON 데이터 반환
const EXPERIENCE_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "경험의 한 줄 요약 제목" },
      situation: { type: Type.STRING, description: "STAR 기법의 S: 상황" },
      task: { type: Type.STRING, description: "STAR 기법의 T: 과제/목표" },
      action: { type: Type.STRING, description: "STAR 기법의 A: 구체적 행동" },
      result: { type: Type.STRING, description: "STAR 기법의 R: 결과/배운점" },
      tags: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "관련 역량 태그 (예: 소통능력, 문제해결)" 
      }
    },
    required: ["title", "situation", "task", "action", "result", "tags"]
  }
};

export const analyzeExperiences = async (history: Message[]): Promise<Experience[]> => {
  if (!apiKey) throw new Error("API Key missing");

  const conversationText = history.map(m => `${m.role}: ${m.text}`).join('\n');
  const prompt = `
    다음은 사용자와의 대화 내용입니다. 
    이 대화에서 사용자가 가진 의미 있는 경험을 추출하여 이력서에 쓸 수 있는 STAR(Situation, Task, Action, Result) 기법으로 정리해주세요.
    최소 2개 이상의 경험을 찾아주세요.
    
    대화 내용:
    ${conversationText}
  `;

  try {
    const ai = getAI();
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: EXPERIENCE_SCHEMA,
      }
    });

    const jsonText = result.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    // ID 생성
    return parsed.map((item: any, index: number) => ({
      ...item,
      id: `exp-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Analysis Error:", error);
    return [];
  }
};

// 3. 단기 성장 추천 (Recommendation)
// 부족한 경험을 채울 수 있는 가상의 추천 활동 생성
const RECOMMENDATION_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      type: { type: Type.STRING, enum: ["Lecture", "Campaign", "Volunteering"] },
      duration: { type: Type.STRING },
      description: { type: Type.STRING },
      benefit: { type: Type.STRING }
    },
    required: ["title", "type", "duration", "description", "benefit"]
  }
};

export const getRecommendations = async (experiences: Experience[]): Promise<Activity[]> => {
  if (!apiKey) throw new Error("API Key missing");

  const existingTags = experiences.flatMap(e => e.tags).join(", ");
  const prompt = `
    사용자는 현재 다음과 같은 역량/경험을 가지고 있습니다: [${existingTags}].
    이 사용자에게 부족한 부분을 보완하거나 강점을 강화할 수 있는, 
    2일에서 5일 이내에 완료 가능한 '구체적인' 단기 활동 3가지를 추천해주세요.
    
    활동 유형은 다음 중 하나여야 합니다:
    1. Lecture: 온라인 단기 강의 (예: 3일 완성 마케팅 기초)
    2. Campaign: 온라인 참여 캠페인 (예: 데이터 라벨링 참여, 오픈소스 기여)
    3. Volunteering: 단기 봉사 (예: 번역 봉사)
    
    대한민국 환경에 맞는 실질적인 활동을 추천해주세요.
  `;

  try {
    const ai = getAI();
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RECOMMENDATION_SCHEMA,
      }
    });

    const jsonText = result.text;
    if (!jsonText) return [];

    const parsed = JSON.parse(jsonText);
    return parsed.map((item: any, index: number) => ({
      ...item,
      id: `act-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Recommendation Error:", error);
    return [];
  }
};