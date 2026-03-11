
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const analyzeThreat = async (input: string, isFile: boolean = false) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please configure your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = isFile 
    ? `Analyze the following file description or code snippet for potential security threats like malware, obfuscation, or backdoors. Provide a risk score (0-100) and specific findings: \n\n${input}`
    : `Analyze the following URL or link for potential phishing, scam, or malicious redirections. Provide a risk score (0-100) and specific concerns: \n\n${input}`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            verdict: { type: Type.STRING },
            threatsDetected: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["riskScore", "summary", "verdict", "threatsDetected"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskScore: 50,
      summary: "Analysis failed or timed out. Manual review recommended.",
      verdict: "Unknown",
      threatsDetected: ["Technical Error"]
    };
  }
};
