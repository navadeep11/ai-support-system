import { reasonWithGroq } from "../ai/groq.js";
export async function routerAgent(message, history, lastIntent) {
    const lower = message.toLowerCase();
    // LEVEL 1: Explicit Intent Switch
    if (lower.includes("order") || lower.includes("ord-")) {
        return "order";
    }
    if (lower.includes("invoice") ||
        lower.includes("billing") ||
        lower.includes("inv-")) {
        return "billing";
    }
    // LEVEL 2: Context continuation
    const contextualWords = [
        "when",
        "status",
        "created",
        "why",
        "how",
        "details",
    ];
    const isContextual = contextualWords.some(word => lower.includes(word));
    if (isContextual && lastIntent) {
        if (lastIntent === "order" ||
            lastIntent === "billing") {
            return lastIntent;
        }
    }
    // LEVEL 3: Greetings → Support
    const greetings = ["hi", "hello", "hey", "thanks", "ok"];
    if (greetings.some(g => lower.includes(g))) {
        return "support";
    }
    // Fallback → AI classification
    const prompt = `
    Classify the intent:
    order
    billing
    support

    Message: "${message}"
    `;
    const result = await reasonWithGroq(prompt);
    const intent = result.toLowerCase();
    if (intent.includes("order"))
        return "order";
    if (intent.includes("billing"))
        return "billing";
    return "support";
}
