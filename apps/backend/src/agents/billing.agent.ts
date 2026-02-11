import { prisma } from "../db/prisma.js";
import { reasonWithGroq } from "../ai/groq.js";

export async function billingAgent(
  message: string,
  conversationId: string,
  history: any[]
) {
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  const extracted = message.match(/INV-\d+/)?.[0];
  const invoiceNo = extracted || convo?.activeInvoiceId;

  if (!invoiceNo) {
    return "🧾 Please share your **Invoice ID** (e.g., INV-001).";
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      activeInvoiceId: invoiceNo,
      lastIntent: "billing",
    },
  });

  const billing = await prisma.billing.findUnique({
    where: { invoiceNo },
  });

  if (!billing) {
    return `❌ Invoice **${invoiceNo}** not found.`;
  }

  const prompt = `
    You are a billing assistant.

    Invoice ID: ${invoiceNo}
    Payment State: ${billing.paymentState}
    Created At: ${billing.createdAt}

    Conversation:
    ${history.map(m => `${m.role}: ${m.content}`).join("\n")}

    User Question:
    ${message}

    Respond clearly.
    `;

  return await reasonWithGroq(prompt);
}
