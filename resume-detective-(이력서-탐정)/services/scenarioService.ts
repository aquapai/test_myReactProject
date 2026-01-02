import { Candidate } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// Fallback data in case API fails or for initial testing
const FALLBACK_CANDIDATE: Candidate = {
  id: 'c_001',
  name: '김하준',
  age: 29,
  photoUrl: 'https://picsum.photos/seed/c_001/200/200',
  education: '서울대학교 경영학과 졸업',
  major: '경영학 / 벤처창업 연계전공',
  summary: [
    '글로벌 대기업 A사 전략기획실 근무',
    '아시아 대학생 혁신 챌린지 대상',
    'TEDx Youth 연사 ("실패를 두려워하지 않는 법")'
  ],
  resumeTitle: '데이터 기반의 혁신을 주도하는 전략가',
  sentences: [
    {
      id: 1,
      text: '저는 서울대학교에서 경영학을 전공하며 논리적 사고와 리더십을 길렀습니다.',
      type: 'halo',
      reason: '학벌을 강조하여 신뢰를 얻으려는 전형적인 후광 효과 문장입니다. 사실 자체는 문제가 없으나 판단을 흐리게 할 수 있습니다.'
    },
    {
      id: 2,
      text: '졸업 후 A사 전략기획실에서 근무하며 전사 매출을 30% 향상시키는 데 핵심적인 기여를 했습니다.',
      type: 'exaggeration',
      reason: '신입/주니어 사원이 전사 매출 30%에 "핵심 기여"를 했다는 것은 과장일 가능성이 매우 높습니다. 구체적 방법론이 빠져있습니다.'
    },
    {
      id: 3,
      text: '특히 제가 도입한 새로운 데이터 분석 툴은 팀의 업무 효율을 획기적으로 개선했습니다.',
      type: 'vague',
      reason: '"획기적"이라는 표현은 모호합니다. 시간 단축 수치나 비용 절감액 등 구체적 지표가 없습니다.'
    },
    {
      id: 4,
      text: '이후 스타트업 B사로 이직하여 마케팅 팀장으로서 6개월간 근무했습니다.',
      type: 'fact',
      reason: '단순한 사실 관계입니다. 하지만 6개월이라는 짧은 재직 기간은 "왜?"라는 의문을 가져야 할 포인트입니다.'
    },
    {
      id: 5,
      text: 'TEDx 강연 경험을 바탕으로, 청중을 사로잡는 프레젠테이션 스킬을 보유하고 있습니다.',
      type: 'halo',
      reason: '유명 브랜드(TEDx)를 언급하여 권위를 빌려오고 있습니다. 실제 강연의 규모나 주제 적합성을 따져봐야 합니다.'
    }
  ]
};

export const fetchRandomCandidate = async (): Promise<Candidate> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key found, using fallback data.");
      return FALLBACK_CANDIDATE;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Randomize the role to ensure diversity
    const roles = ['Software Engineer', 'Product Manager', 'Digital Marketer', 'Data Scientist', 'Sales Specialist', 'UX Designer'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    const prompt = `
      Create a profile for a job applicant in a simulation game called "Resume Detective".
      Role: ${randomRole}
      Language: Korean (Must be natural Korean)

      The goal of the game is for the user to detect lies, exaggerations, and "Halo Effect" (using prestigious names/awards to mask lack of substance).

      Please generate a JSON object.
      
      CRITICAL INSTRUCTION: You MUST include the 'sentences' array with 5 to 7 items.
      
      Structure requirements:
      1. id: unique string
      2. name: Korean name
      3. age: number (20-35)
      4. education: Prestigious university in Korea or abroad (to trigger Halo Effect)
      5. major: Major related to the role
      6. summary: 3 very impressive bullet points (e.g., worked at Big Tech, won grand awards)
      7. resumeTitle: Catchy, slightly overconfident title
      8. sentences: An array of 5-7 self-introduction sentences. 
         - Mix 'fact', 'exaggeration', 'halo', and 'vague' types.
         - 'halo': Mentions prestigious names (Harvard, Google, Samsung, etc.) to sound good.
         - 'exaggeration': Claims unrealistic results (e.g., "Tripled revenue in 1 month") without proof.
         - 'vague': Uses buzzwords like "innovative", "synergy", "paradigm shift" without specifics.
         - 'fact': Boring but true facts.
         - For each sentence, provide a 'reason' explaining why it is suspicious or safe.
         - 'type' should be one of: 'fact', 'exaggeration', 'halo', 'vague'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            age: { type: Type.INTEGER },
            education: { type: Type.STRING },
            major: { type: Type.STRING },
            summary: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            resumeTitle: { type: Type.STRING },
            sentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  type: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["id", "text", "type", "reason"]
              }
            }
          },
          required: ["id", "name", "age", "education", "major", "summary", "resumeTitle", "sentences"]
        }
      }
    });

    if (!response.text) {
        throw new Error("No text returned from AI");
    }

    const data = JSON.parse(response.text);
    
    // Critical Validation: Ensure sentences exist and is an array
    if (!data.sentences || !Array.isArray(data.sentences) || data.sentences.length === 0) {
        console.error("Invalid AI Data Structure:", data);
        throw new Error("Candidate data missing valid sentences array");
    }

    // Add a consistent photo based on ID
    return {
      ...data,
      photoUrl: `https://picsum.photos/seed/${data.id || Math.random()}/200/200`
    };

  } catch (error) {
    console.error("Failed to generate candidate:", error);
    return FALLBACK_CANDIDATE;
  }
};