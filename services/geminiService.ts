
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_TEXT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please ensure process.env.API_KEY is available.");
  // Potentially throw an error or handle this state gracefully in the UI.
  // For now, functions will return error messages if API_KEY is missing.
}

const getAiClient = () => {
  if (!API_KEY) return null;
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const suggestDishName = async (basePrompt: string, cuisineType: string = "Indian"): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured. Cannot suggest name.";

  const prompt = `Suggest one creative and appealing ${cuisineType} dish name based on the following characteristics or ingredients: "${basePrompt}". Provide only the dish name itself, without any introductory phrases, explanations, or quotation marks.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: { temperature: 0.8, topP: 0.9, topK: 40 }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error suggesting dish name:", error);
    return "Error generating name. Please try again.";
  }
};

export const generateDishDescription = async (dishName: string, dishType: string, keyIngredients: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured. Cannot generate description.";
  
  const prompt = `Generate a concise and appealing menu description for an Indian dish named "${dishName}". It is a ${dishType} dish. Key ingredients include: ${keyIngredients}. The description should be suitable for a restaurant menu, ideally 2-3 sentences long. Highlight its taste and texture. Do not use markdown or lists.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: { temperature: 0.7, topP: 0.85, topK: 50 }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating dish description:", error);
    return "Error generating description. Please try again.";
  }
};
    