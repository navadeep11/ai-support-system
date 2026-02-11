import { reasonWithGroq } from "../ai/groq.js";
export async function supportAgent(message, history) {
    const prompt = `
You are a helpful customer support assistant.

Conversation History:
${history.map(m => `${m.role}: ${m.content}`).join("\n")}

User Message:
${message}

Respond naturally and professionally.
`;
    return await reasonWithGroq(prompt);
}
