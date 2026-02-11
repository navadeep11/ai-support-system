import { prisma } from "../db/prisma.js";
import { routerAgent } from "../agents/router.agent.js";
import { orderAgent } from "../agents/order.agent.js";
import { billingAgent } from "../agents/billing.agent.js";
import { supportAgent } from "../agents/support.agent.js";
export async function handleMessage(message, conversationId, history) {
    const convo = await prisma.conversation.findUnique({
        where: { id: conversationId },
    });
    const intent = await routerAgent(message, history, convo?.lastIntent);
    switch (intent) {
        case "order":
            return await orderAgent(message, conversationId, history);
        case "billing":
            return await billingAgent(message, conversationId, history);
        default:
            return await supportAgent(message, history);
    }
}
