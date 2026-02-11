import { Hono } from "hono";
import { chatRpc } from "./chat.rpc.js";
import { conversationRpc } from "./conversation.rpc.js";

export const rpc = new Hono();

rpc.route("/chat", chatRpc);
rpc.route("/conversations", conversationRpc);