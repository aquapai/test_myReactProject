import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 이력서 요약을 AI로 다듬어주는 함수
export const enhanceResumeSummary = async (currentSummary: string, role: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      당신은 채용 전문가입니다. 아래의 지원자 자기소개(Summary)를 분석하여, 
      지원자의 이름, 나이, 성별 등 개인 신상 정보는 절대 포함하지 말고, 
      오직 직무 역량과 성과 중심으로 내용을 3문장 이내로 전문적으로 다듬어주세요.
      지원 직무: ${role}
      
      [원본 내용]
      ${currentSummary}
      
      [수정된 내용]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "AI 응답을 불러올 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 최적화 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};