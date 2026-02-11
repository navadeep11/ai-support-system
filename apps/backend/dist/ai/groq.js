import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
export async function reasonWithGroq(prompt) {
    const result = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
        temperature: 0.3,
    });
    return result.text.trim();
}
