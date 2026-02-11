import { useEffect, useRef, useState } from "react";
import { client } from "../rpc/client.js";

export default function ChatBox({
  conversationId,
  setConversationId,
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  /* ===============================
     AUTO SCROLL
  =============================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* ===============================
     LOAD CONVERSATION WHEN CLICKED
  =============================== */
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    async function loadConversation() {
      try {
        const res =
          await client.rpc.conversations[
            ":id"
          ].$get({
            param: { id: conversationId },
          });

        const data = await res.json();

        if (data?.messages) {
          setMessages(
            data.messages.map((m) => ({
              role: m.role,
              text: m.content,
            }))
          );
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
        setMessages([]);
      }
    }

    loadConversation();
  }, [conversationId]);

  /* ===============================
     SEND MESSAGE
  =============================== */
  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setIsTyping(true);

    try {
      const res =
        await client.rpc.chat.sendMessage.$post({
          json: {
            message: userMessage,
            conversationId,
          },
        });

      const data = await res.json();

      setConversationId(data.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong.",
        },
      ]);
    }

    setIsTyping(false);
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        AI Support Assistant
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message-bubble ${
              m.role === "user"
                ? "user-message"
                : "assistant-message"
            }`}
          >
            {m.text}
          </div>
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat-input-area">
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type a message..."
          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendMessage()
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
