import { GoogleGenAI, Type } from "@google/genai";
import type { ComparisonResult, Suggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSentenceSuggestions(topic: string): Promise<ComparisonResult> {
    try {
        // 1. Simple Prompt
        const simplePrompt = `"${topic}"에 대한 5가지 문장 제안을 생성해 주세요.`;
        const simpleResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: simplePrompt
        });
        const simpleResultText = simpleResponse.text;

        // 2. Refined Prompt with JSON Schema
        const refinedPromptForDisplay = `당신은 고도로 발달된 AI 작문 어시스턴트입니다. 당신의 목표는 "${topic}"이라는 주제에 대해 다양하고, 전문적이며, 문맥에 맞는 5가지 문장 제안을 제공하는 것입니다. 당신은 응답 시 제공된 JSON 스키마를 엄격하게 준수해야 합니다.`;
        const refinedResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: refinedPromptForDisplay,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            description: "5개의 문장 제안이 담긴 배열입니다.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sentence: {
                                        type: Type.STRING,
                                        description: "추천 문장입니다."
                                    },
                                    tone: {
                                        type: Type.STRING,
                                        description: "문장의 톤입니다 (예: 격식체, 편안한, 설득력 있는)."
                                    }
                                },
                                required: ["sentence", "tone"]
                            }
                        }
                    },
                    required: ["suggestions"]
                },
            },
        });

        let refinedResultJson: { suggestions: Suggestion[] } = { suggestions: [] };
        try {
            const jsonText = refinedResponse.text.trim();
            refinedResultJson = JSON.parse(jsonText);
        } catch (e) {
            console.error("Failed to parse refined prompt JSON response:", e);
            throw new Error("AI가 정제된 프롬프트에 대해 잘못된 형식의 응답을 반환했습니다. 다시 시도해 주세요.");
        }
        
        return {
            simplePrompt,
            simpleResult: simpleResultText,
            refinedPrompt: refinedPromptForDisplay,
            refinedResult: refinedResultJson.suggestions || [],
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("AI 모델로부터 제안을 가져오는 데 실패했습니다.");
    }
}