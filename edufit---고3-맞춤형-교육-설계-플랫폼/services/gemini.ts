
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface DiagnosisData {
  wakeTime: string;
  studyHours: number;
  phoneUsage: number;
  preference: 'self' | 'managed';
  recovery: 'high' | 'low';
}

export interface RecommendationResult {
  title: string;
  url: string;
  reason: string;
}

export async function analyzeStudyPattern(data: DiagnosisData) {
  const prompt = `고3 수험생의 학습 데이터 분석:
    - 기상시간: ${data.wakeTime}
    - 하루 공부: ${data.studyHours}시간
    - 스마트폰 사용: ${data.phoneUsage}시간
    - 선호 방식: ${data.preference === 'self' ? '자기주도' : '관리형'}
    - 회복탄력성: ${data.recovery === 'high' ? '높음' : '낮음'}
    
    위 데이터를 기반으로 이 학생에게 가장 적합한 학습 유형과 맞춤 전략 3가지를 제시해주세요.
    또한, 하루 일과를 시간대별로 3개 핵심 블록(오전, 오후, 저녁)으로 나누어 추천 일정을 포함하세요.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "당신은 고3 전문 교육 컨설턴트입니다. 인지 심리학에 기반하여 학생의 강점과 약점을 분석하고 실질적인 솔루션을 JSON 형식으로 제안하세요.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          typeTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          strategies: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                tip: { type: Type.STRING }
              }
            }
          },
          matchingScore: { type: Type.NUMBER }
        },
        required: ["typeTitle", "description", "strategies", "schedule", "matchingScore"]
      },
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return JSON.parse(response.text);
}

export async function getGroundedRecommendations(typeTitle: string) {
  const prompt = `${typeTitle} 성향의 고3 수험생에게 추천할 만한 최신(2024-2025) 인터넷 강의 브랜드, 학원 시스템, 혹은 학습 도구 3가지를 구체적으로 추천하고 그 이유를 설명해줘.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text;
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return {
    text,
    sources: groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((s: any) => s.title && s.uri)
  };
}
