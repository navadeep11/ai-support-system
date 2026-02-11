import { Hono } from "hono";
import {
  createConversation,
  listConversations,
  getConversationById,
  deleteConversation,
} from "../tools/conversation.tool.js";

export const conversationRpc = new Hono();

/* ===============================
   CREATE CONVERSATION
=============================== */
conversationRpc.post("/", async (c) => {
  try {
    const conversation = await createConversation();
    return c.json(conversation);
  } catch (error) {
    console.error("Create error:", error);
    return c.json({ error: "Failed to create" }, 500);
  }
});

/* ===============================
   LIST CONVERSATIONS
=============================== */
conversationRpc.get("/", async (c) => {
  try {
    const conversations = await listConversations();
    return c.json(conversations);
  } catch (error) {
    console.error("List error:", error);
    return c.json({ error: "Failed to fetch" }, 500);
  }
});

/* ===============================
   GET SINGLE CONVERSATION
=============================== */
conversationRpc.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const conversation = await getConversationById(id);

    if (!conversation) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json(conversation);
  } catch (error) {
    console.error("Get error:", error);
    return c.json({ error: "Failed to fetch" }, 500);
  }
});

/* ===============================
   DELETE CONVERSATION
=============================== */
conversationRpc.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await deleteConversation(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return c.json({ error: "Delete failed" }, 500);
  }
});
