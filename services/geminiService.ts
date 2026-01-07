
import { GoogleGenAI } from "@google/genai";

export const getWealthProtectionInsight = async (gsWeight: number) => {
  // Inizializzazione rigorosa secondo linee guida SDK
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Agisci come un esperto di consulenza patrimoniale d'élite. 
    Spiega i vantaggi di una polizza Multiramo Zurich Multinvest Plus con un'allocazione del ${gsWeight}% in Gestione Separata "Zurich Trend".
    Focalizzati su:
    1. Protezione del capitale e stabilità (Ramo I).
    2. Impignorabilità e Insequestrabilità (art. 1923 c.c.).
    3. Esenzione fiscale in successione.
    Usa un tono professionale, rassicurante e sofisticato in italiano.
    Massimo 3 punti elenco chiari e convincenti.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "La Gestione Separata Zurich Trend garantisce la protezione del capitale investito, offrendo stabilità in scenari di volatilità e vantaggi successori esclusivi.";
  }
};
