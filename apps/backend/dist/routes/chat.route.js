import { Hono } from "hono";
import { handleMessage } from "../services/chat.service.js";
import { createConversation, addMessage, getMessages, } from "../tools/conversation.tool.js";
const chatRoute = new Hono();
/**
 * POST /api/chat/messages
 * body: { message: string, conversationId?: string }
 */
chatRoute.post("/messages", async (c) => {
    try {
        const body = await c.req.json();
        const { message, conversationId } = body;
        if (!message) {
            return c.json({ error: "Message is required" }, 400);
        }

        // create or reuse conversation
        const conversation = conversationId ? { id: conversationId }: await createConversation();

        // store user message
        await addMessage(conversation.id, "user", message);
        const agentResult = await handleMessage(message);

        /**
         * 🚫 Streaming disabled for Node stability
         */
        if (typeof agentResult === "object" &&
            agentResult !== null &&
            "toDataStreamResponse" in agentResult) {
            // ❌ DO NOT store stream in DB
            // Just respond to client
            return c.json({
                conversationId: conversation.id,
                response: "[AI response streamed]",
            });
        }


        // normal string response
        // Ensure only STRING is stored
        if (typeof agentResult === "string") {
            await addMessage(conversation.id, "agent", agentResult);
        }
        return c.json({
            conversationId: conversation.id,
            response: agentResult,
        });
    }
    catch (err) {
        console.error("❌ Chat route error:", err);
        return c.json({ error: "Internal server error" }, 500);
    }
});


/**
 * GET /api/chat/conversations/:id
 */
chatRoute.get("/conversations/:id", async (c) => {
    const id = c.req.param("id");
    const messages = await getMessages(id);
    return c.json({ messages });
});
export default chatRoute;
