
import { GoogleGenAI } from "@google/genai";
import { CryptoSignal, Indicators, Coin } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getSignalExplanation(coin: Coin, signal: CryptoSignal, indicators: Indicators): Promise<string> {
  if (!process.env.API_KEY) return "AI services currently unavailable (Missing API Key).";
  
  const prompt = `
    Act as a professional crypto analyst. Explain the following trading signal to a user.
    
    Coin: ${coin.name} (${coin.symbol})
    Current Price: $${coin.price}
    Signal Type: ${signal.type}
    Score: ${signal.score}/100
    
    Technical Context:
    - RSI: ${indicators.rsi.toFixed(2)}
    - EMA50: ${indicators.ema50.toFixed(2)}
    - EMA200: ${indicators.ema200.toFixed(2)}
    - ADX: ${indicators.adx}
    - Reasons given by system: ${signal.reasons.join(', ')}
    
    Provide a concise, human-friendly explanation of why this signal was generated, potential risks, and what to watch for. 
    Format with bullet points if helpful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    return response.text || "Unable to generate explanation.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI analysis. Please try again later.";
  }
}
