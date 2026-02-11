import { prisma } from "../db/prisma.js";

/* ===============================
   CREATE CONVERSATION
=============================== */
export async function createConversation() {
  return prisma.conversation.create({
    data: {},
  });
}

/* ===============================
   LIST CONVERSATIONS
=============================== */
export async function listConversations() {
  return prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
    },
  });
}

/* ===============================
   GET CONVERSATION WITH MESSAGES
=============================== */
export async function getConversationById(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

/* ===============================
   SAVE MESSAGE
=============================== */
export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}

/* ===============================
   GET LAST MESSAGES
=============================== */
export async function getLastMessages(
  conversationId: string,
  limit = 10
) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return messages.reverse();
}

/* ===============================
   DELETE CONVERSATION (SAFE)
=============================== */
export async function deleteConversation(id: string) {
  await prisma.$transaction([
    prisma.message.deleteMany({
      where: { conversationId: id },
    }),
    prisma.conversation.delete({
      where: { id },
    }),
  ]);

  return { success: true };
}
