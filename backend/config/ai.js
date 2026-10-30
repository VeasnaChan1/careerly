import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
} else {
  ai = {
    interactions: {
      create: async ({ input, system_instruction }) => {
        return {
          output_text: `Enhanced: ${input.replace(/^enhance (my )?(job description|professional summary)?\s*[:"']?/i, "").replace(/["']$/i, "").trim()} — proven expertise, impactful results, and collaborative execution.`
        };
      }
    }
  };
}

export default ai;
