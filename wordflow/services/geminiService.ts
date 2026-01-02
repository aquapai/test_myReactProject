import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API KEY not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (word: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key가 설정되지 않았습니다.";

  try {
    const prompt = `
      너는 한국의 고3 수험생을 위한 영어 1타 강사야.
      단어: "${word}"
      
      이 단어에 대해 다음 내용을 포함해서 200자 이내로 설명해줘:
      1. 핵심 뜻 (가장 수능에 많이 나오는 뜻)
      2. 암기 팁 (어원이나 연상법)
      3. 뉘앙스 (비슷한 단어와의 차이점 등)
      
      말투는 친절하고 격려하는 투로 해줘. JSON이 아닌 일반 텍스트로 답변해.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "설명을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 설명을 불러오는 중 오류가 발생했습니다.";
  }
};
