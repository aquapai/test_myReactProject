import { GoogleGenAI, Type } from "@google/genai";
import { QuizCategory, Quiz, AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Generates a creative lateral thinking quiz based on the category.
 */
export const generateQuiz = async (category: QuizCategory): Promise<Quiz> => {
  const prompt = `
    당신은 한국의 창의력 개발 멘토입니다. 고등학교 3학년 학생이 창의적인 사고를 통해 스트레스를 풀 수 있도록 "${category}" 카테고리에 맞는 '수평적 사고(Lateral Thinking)' 퀴즈 1개를 만들어주세요.

    조건:
    1. 정답이 하나가 아닙니다.
    2. 고정관념을 깨야만 답할 수 있습니다.
    3. 한국의 고등학생이 공감할 수 있는 소재(학교, 시험, 친구, 미래 등)를 활용하면 좋습니다.
    4. 질문은 흥미롭고 재미있어야 합니다.
    5. 출력은 반드시 한국어로 해주세요.
    
    예시(사물의 재발견): "만약 10,000개의 컴싸(컴퓨터용 사인펜)로 강을 건너야 한다면 어떻게 하겠는가?"
    예시(거꾸로 생각하기): "시험 점수가 낮을수록 칭찬받는 세상이 되었다. 학교 풍경은 어떻게 변할까?"
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "퀴즈 질문" },
            context: { type: Type.STRING, description: "질문의 배경이나 간단한 상황 설정 (선택사항)" },
          },
          required: ["question"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      category,
      question: data.question,
      context: data.context || "",
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback in case of API error
    return {
      id: crypto.randomUUID(),
      category,
      question: "존재하지 않는 색깔을 하나 상상하고, 그 색깔을 볼 때 어떤 기분이 드는지 묘사해보세요.",
      context: "시스템 연결이 원활하지 않아 기본 질문을 제공합니다.",
    };
  }
};

/**
 * Analyzes the user's answer for creativity metrics.
 */
export const analyzeAnswer = async (quiz: Quiz, userAnswer: string): Promise<AnalysisResult> => {
  const prompt = `
    다음은 창의성 퀴즈에 대한 한국 고등학생의 답변입니다. 이 답변을 분석해주세요.
    
    질문: "${quiz.question}"
    사용자 답변: "${userAnswer}"
    
    다음 기준에 따라 평가해주세요 (0~100점):
    1. 유창성 (Divergence): 생각이 얼마나 넓게 확장되었는가?
    2. 독창성 (Originality): 남들이 생각하기 힘든 아이디어인가?
    3. 유연성 (Flexibility): 관점을 다양하게 전환했는가?
    4. 논리성 (Logic): 상상 속에서 나름의 논리가 있는가?
    5. 재미/위트 (Humor): 답변이 재치있는가?
    
    피드백 조건:
    - 말투: 따뜻하고 격려하는 멘토 말투 (해요체 사용).
    - 피드백 길이: 최대 2문장.
    - 개선 팁: 구체적인 행동 제안 1가지.
    - 언어: 한국어.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            divergence: { type: Type.NUMBER },
            originality: { type: Type.NUMBER },
            flexibility: { type: Type.NUMBER },
            logic: { type: Type.NUMBER },
            humor: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            improvementTip: { type: Type.STRING },
          },
          required: ["divergence", "originality", "flexibility", "logic", "humor", "feedback", "improvementTip"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    const scores = {
      divergence: data.divergence || 0,
      originality: data.originality || 0,
      flexibility: data.flexibility || 0,
      logic: data.logic || 0,
      humor: data.humor || 0,
    };
    
    // Calculate simple average for total score
    const totalScore = Math.round(
      (scores.divergence + scores.originality + scores.flexibility + scores.logic + scores.humor) / 5
    );

    return {
      scores,
      feedback: data.feedback,
      improvementTip: data.improvementTip,
      totalScore,
    };
  } catch (error) {
    console.error("Error analyzing answer:", error);
    return {
      scores: { divergence: 50, originality: 50, flexibility: 50, logic: 50, humor: 50 },
      feedback: "연결 문제로 인해 자세한 분석을 할 수 없지만, 당신의 생각은 멋졌어요!",
      improvementTip: "잠시 후 다시 시도해보세요.",
      totalScore: 50,
    };
  }
};