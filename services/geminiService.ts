
import { GoogleGenAI, Type } from "@google/genai";
import { AiInsight } from '../types';

// The API key is assumed to be available in process.env.API_KEY.

export const getBusinessInsights = async (prompt: string): Promise<AiInsight> => {
  console.log("Querying Gemini with prompt:", prompt);

  // Use the Gemini API to get business insights based on the user's prompt.
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following lead information, provide a qualification rating, a cash forecast, and a brief summary. Lead info: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.STRING, description: 'Lead rating (e.g., High, Medium, Low)' },
            cashForecast: { type: Type.NUMBER, description: 'Estimated cash flow from this lead' },
            summary: { type: Type.STRING, description: 'A brief summary of the lead qualification.' },
          },
          required: ['rating', 'cashForecast', 'summary'],
        },
      },
    });
    const result = JSON.parse(response.text);
    return result as AiInsight;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get insights from AI.");
  }
};