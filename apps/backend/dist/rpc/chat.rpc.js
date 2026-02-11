import { Hono } from "hono";
import { createConversation, saveMessage, getLastMessages, } from "../tools/conversation.tool.js";
import { handleMessage } from "../services/chat.service.js";
export const chatRpc = new Hono();
/* ===============================
   SEND MESSAGE
=============================== */
chatRpc.post("/sendMessage", async (c) => {
    try {
        const { message, conversationId } = await c.req.json();
        if (!message?.trim()) {
            return c.json({ error: "Message required" }, 400);
        }
        let convoId = conversationId;
        if (!convoId) {
            const conversation = await createConversation();
            convoId = conversation.id;
        }
        await saveMessage(convoId, "user", message);
        const history = await getLastMessages(convoId, 10);
        const response = await handleMessage(message, convoId, history);
        await saveMessage(convoId, "assistant", response);
        return c.json({
            conversationId: convoId,
            response,
        });
    }
    catch (error) {
        console.error("sendMessage error:", error);
        return c.json({ error: "Internal error" }, 500);
    }
});
