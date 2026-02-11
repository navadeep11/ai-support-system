import { prisma } from "../db/prisma.js";
import { reasonWithGroq } from "../ai/groq.js";

export async function orderAgent(
  message: string,
  conversationId: string,
  history: any[]
) {
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  const extracted = message.match(/ORD-\d+/)?.[0];
  const orderId = extracted || convo?.activeOrderId;

  if (!orderId) {
    return "📦 Please share your **Order ID** (e.g., ORD-001).";
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      activeOrderId: orderId,
      lastIntent: "order",
    },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return `❌ Order **${orderId}** not found.`;
  }

  const prompt = `
      You are an order assistant.

      Order ID: ${orderId}
      Status: ${order.status}
      Created At: ${order.createdAt}

      Conversation:
      ${history.map(m => `${m.role}: ${m.content}`).join("\n")}

      User Question:
      ${message}

      Respond professionally.
      `;

  return await reasonWithGroq(prompt);
}
