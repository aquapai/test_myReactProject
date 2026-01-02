import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RevisedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

export const analyzePortfolio = async (text: string): Promise<AnalysisResult> => {
  const prompt = `
    You are a career consultant expert in the "Halo Effect" psychology.
    Analyze the following portfolio/resume text.
    
    Evaluate it based on three criteria:
    1. Authority (Reliability): Usage of prestigious names, citations, recognizable brands, or authoritative jargon.
    2. Numbers (Quantification): Presence of specific metrics, growth rates, periods, and concrete data.
    3. Visual/Impact (First Impression): Strong verbs, clear structure, and engaging hook (text-based impact).

    Provide a score from 0 to 100 for each.
    Provide specific feedback for each category on how to improve the "Halo Effect".
    
    **IMPORTANT: The output JSON content (feedback, summary) MUST be in Korean language.**

    Text to analyze:
    "${text.substring(0, 5000)}"
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          haloScore: {
            type: Type.OBJECT,
            properties: {
              authority: { type: Type.NUMBER },
              numbers: { type: Type.NUMBER },
              visualImpact: { type: Type.NUMBER },
            },
            required: ["authority", "numbers", "visualImpact"],
          },
          feedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING, enum: ["Authority", "Numbers", "Visual"] },
                issue: { type: Type.STRING },
                suggestion: { type: Type.STRING },
              },
              required: ["category", "issue", "suggestion"],
            },
          },
          overallSummary: { type: Type.STRING },
        },
        required: ["haloScore", "feedback", "overallSummary"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as AnalysisResult;
  }
  
  throw new Error("Failed to analyze portfolio");
};

export const upgradeSentence = async (originalSentence: string): Promise<RevisedContent> => {
  const prompt = `
    Apply the "Halo Effect" to the following resume sentence. 
    Rewrite it to be:
    1. More authoritative (Authority Lending).
    2. Quantifiable (Guess reasonable metrics if needed, but mark them as examples).
    3. High-impact (Stronger verbs).

    **IMPORTANT: The output JSON content (revised, explanation) MUST be in Korean language.**

    Original: "${originalSentence}"
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          revised: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Explain why this change creates a Halo Effect." },
        },
        required: ["original", "revised", "explanation"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as RevisedContent;
  }

  throw new Error("Failed to upgrade sentence");
};