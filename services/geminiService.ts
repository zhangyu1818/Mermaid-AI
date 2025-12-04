import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fixMermaidCode(brokenCode: string, errorMessage: string): Promise<string> {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are an expert in Mermaid.js diagramming.
    The user has provided the following Mermaid code which might be broken or poorly formatted.
    Error message received: "${errorMessage}"

    User Code:
    \`\`\`mermaid
    ${brokenCode}
    \`\`\`

    Your task:
    1. Fix any syntax errors preventing it from rendering.
    2. Improve the formatting and indentation.
    3. Make sure the direction (e.g., TD, LR) makes sense for the content.
    4. Return ONLY the raw Mermaid code string. Do NOT wrap it in markdown code blocks (no \`\`\`mermaid or \`\`\`). Do NOT include any explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    // Clean up just in case the model adds markdown despite instructions
    let fixed = response.text || '';
    fixed = fixed.replace(/^```mermaid\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '');
    return fixed.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fix code via AI");
  }
}