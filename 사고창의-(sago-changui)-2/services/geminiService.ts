
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getThinkingQuestions = async (userPrompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `사용자의 질문: "${userPrompt}". 
    이 질문에 정답을 직접 주지 마세요. 대신 사용자가 스스로 생각하도록 유도하는 소크라테스식 질문 3가지를 만드세요. 
    사용자는 고등학교 3학년 학생입니다.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "사고 유도 질문 리스트"
          },
          intent: {
            type: Type.STRING,
            description: "질문의 의도 설명"
          }
        },
        required: ["questions", "intent"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getCreativeExpansion = async (topic: string, userThought: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `주제: "${topic}", 사용자의 생각: "${userThought}". 
    이 생각에 대해 1. 다른 관점, 2. 비유적 표현, 3. 반대 의견을 제안하세요.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          perspective: { type: Type.STRING, description: "새로운 관점" },
          analogy: { type: Type.STRING, description: "비유" },
          counter: { type: Type.STRING, description: "반대 의견" }
        },
        required: ["perspective", "analogy", "counter"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getComparisonData = async (topic: string, finalThought: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `주제: "${topic}". 사용자의 최종 생각: "${finalThought}".
    1. 이 주제에 대해 AI가 내놓을 법한 일반적이고 뻔한 답변을 작성하세요.
    2. 사용자의 생각과 비교했을 때, 사용자의 생각이 갖는 독창적인 가치를 한 줄로 평가하세요.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          genericAnswer: { type: Type.STRING, description: "일반적인 AI 답변" },
          uniqueValue: { type: Type.STRING, description: "사용자 사고의 가치 평가" }
        },
        required: ["genericAnswer", "uniqueValue"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const getDailyMission = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: "고등학생의 사고력을 자극할 수 있는 짧고 철학적인 '오늘의 사고 미션' 주제 하나를 생성하세요.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mission: { type: Type.STRING, description: "미션 주제" },
          tip: { type: Type.STRING, description: "생각할 거리 팁" }
        },
        required: ["mission", "tip"]
      }
    }
  });
  return JSON.parse(response.text);
};
