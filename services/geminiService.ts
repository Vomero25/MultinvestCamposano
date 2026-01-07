
import { GoogleGenAI } from "@google/genai";

// Shimming preventivo per ambienti browser puri
const apiKey = (typeof process !== 'undefined' && process.env.API_KEY) || '';
const ai = new GoogleGenAI({ apiKey });

export const getWealthProtectionInsight = async (gsWeight: number) => {
  const prompt = `
    Explaining the value of a Multibranch Life Insurance (Zurich Multinvest Plus) with a ${gsWeight}% allocation in "Gestione Separata" (Separated Account).
    Focus on:
    1. Capital Protection and stability.
    2. Tax benefits in Italy (Succession tax exemption).
    3. Asset protection from creditors (Impignorabilità e Insequestrabilità).
    Keep it professional, high-end, and in Italian.
    Maximum 3 bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Errore nel caricamento degli approfondimenti. La Gestione Separata garantisce stabilità e protezione del capitale nel tempo.";
  }
};
