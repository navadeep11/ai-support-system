import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function generateGeminiText(prompt) {
    const model = genAI.getGenerativeModel({
        model: "models/gemini-1.5-flash", // ✅ correct for v1
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
}
