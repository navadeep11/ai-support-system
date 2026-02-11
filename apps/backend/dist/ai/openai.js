import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
export function streamAIResponse(prompt) {
    return streamText({
        model: openai("gpt-3.5-turbo"),
        prompt,
    });
}
