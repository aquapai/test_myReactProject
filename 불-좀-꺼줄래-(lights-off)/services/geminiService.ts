import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, TruthLabel } from "../types";

// Initialize Gemini Client
// CRITICAL: process.env.API_KEY is handled by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to extract JSON from markdown code blocks or raw text
function cleanJsonString(text: string): string {
  if (!text) return "{}";
  
  // First try to find a JSON block in markdown
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match) return match[1];

  // If no markdown, try to find the first '{' and last '}'
  const firstOpen = text.indexOf('{');
  const lastClose = text.lastIndexOf('}');
  
  if (firstOpen !== -1 && lastClose !== -1) {
    return text.substring(firstOpen, lastClose + 1);
  }
  
  return text;
}

export const analyzeNews = async (input: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Apply the **Protocol-100 Fact-Assessment Framework** strictly to analyze the following input text/claim.
      
      Input text: "${input}"

      ────────────────────────────────────────
      [Protocol-100 Fact-Assessment Framework]

      1. 원문 구조 분석
         - 텍스트의 주장, 인용, 수치, 인물, 사건을 항목별로 분해한다.
         - 주장과 의견, 사실 진술을 명확히 구분한다.

      2. 출처 검증 (Source Verification)
         - 텍스트가 직접 언급하는 출처를 식별하고 실존 여부, 신뢰도, 맥락을 평가한다.
         - 익명·출처 불명·단일 출처의 경우 위험도를 상향 조정한다.

      3. 사실 검증 (Claim Verification) using Google Search Tool
         - 주요 주장을 검증 가능한 형태로 재구성하여 검색한다.
         - 알려진 데이터, 관측 가능한 사실, 공식 기록과 대조한다.

      4. 논리·언어 패턴 분석 (Logic & Language Pattern)
         - 공포 조성, 과도한 일반화, 이분법, 감정적 호소(Halo Effect), 음모론적 구조를 탐지한다.
         - "충격 폭로", "절대 밝힐 수 없는" 등의 회피성 표현을 검출한다.

      5. 조작 신호 탐지 (Manipulation Detection)
         - 비정상적 통계, 출처 없는 수치, 인용 왜곡 가능성을 평가한다.

      6. 가능성 판단 (Probability Judgment)
         - 위 1~5 항목을 종합하여 다음 중 하나로 결정한다:
           (A) 사실 가능성 (Facts Likely)
           (B) 부정확 가능성 (Inaccurate Likely - 왜곡/과장 포함)
           (C) 허위 가능성 (False Likely - 핵심이 사실과 충돌)

      7. 결과 산출
         - 최종 분류: A/B/C 중 하나
         - 핵심 근거: 3개 이상
         - 논리 오류 및 조작 신호 명시
      ────────────────────────────────────────

      **OUTPUT INSTRUCTIONS**:
      - The output MUST be a **Plain Text String** containing a valid JSON object.
      - Do NOT use Markdown formatting (no \`\`\`json).
      - Do NOT use MIME types.
      - **Language**: Korean (Professional, Objective Tone).

      **Mapping Protocol-100 to JSON Fields**:
      - truthLabel: 
          (A) -> "TRUE"
          (B) -> "MIXED"
          (C) -> "FALSE"
          If unknown -> "UNVERIFIED"
      - haloScore: Score (0-100) based on Step 4 (Language Pattern) & Step 5 (Manipulation). High score means high emotional/manipulative content.
      - haloFactors: List patterns found in Step 4 & 5 (e.g., "공포 조성", "출처 불명 수치").
      - keyPoints: The "Core Evidence" and "Verification Results" from Step 7.

      **JSON Structure**:
      {
        "title": "객관적인 기사 제목 (Korean)",
        "summary": "Protocol-100 분석 요약 (2 sentences, Professional Korean)",
        "truthLabel": "TRUE" | "FALSE" | "MIXED" | "UNVERIFIED",
        "confidenceScore": number (0-100),
        "haloScore": number (0-100),
        "haloFactors": ["Factor 1", "Factor 2"],
        "keyPoints": ["Evidence 1", "Evidence 2", "Evidence 3"]
      }

      If you cannot access the URL content, return a plain text error message, NOT a JSON.
    `;

    // Guidelines: Do NOT set responseMimeType or responseSchema when using googleSearch tool.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || "";
    const jsonText = cleanJsonString(rawText);
    
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      // If parsing fails, assume the model returned a plain text error message (as requested in prompt)
      // or the response was malformed. Use the raw text as the summary if it's reasonable.
      console.warn("JSON Parse failed. Treating response as plain text error message.", rawText);
      
      const fallbackSummary = rawText.length > 0 && rawText.length < 300 
        ? rawText 
        : "Protocol-100 분석을 완료할 수 없습니다. 데이터 형식을 확인해주세요.";

      return {
        title: "분석 불가",
        summary: fallbackSummary,
        truthLabel: TruthLabel.UNVERIFIED,
        confidenceScore: 0,
        haloScore: 0,
        haloFactors: ["분석 실패"],
        keyPoints: [],
        sources: []
      };
    }

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri,
      }));

    // Remove duplicates based on URI
    const uniqueSources = Array.from(new Map(sources.map((item: any) => [item.uri, item])).values());

    return {
      title: data.title || "분석된 기사",
      summary: data.summary || "요약을 생성할 수 없습니다.",
      truthLabel: (data.truthLabel as TruthLabel) || TruthLabel.UNVERIFIED,
      confidenceScore: data.confidenceScore || 0,
      haloScore: data.haloScore || 0,
      haloFactors: data.haloFactors || [],
      keyPoints: data.keyPoints || [],
      sources: uniqueSources as any[],
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a fallback error result
    return {
      title: "시스템 오류",
      summary: "Protocol-100 실행 중 문제가 발생했습니다.",
      truthLabel: TruthLabel.UNVERIFIED,
      confidenceScore: 0,
      haloScore: 0,
      haloFactors: ["네트워크/서버 오류"],
      keyPoints: [],
      sources: []
    };
  }
};