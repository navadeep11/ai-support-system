import { useEffect, useState } from "react";
import { client } from "../rpc/client.js";

export default function Sidebar({
  conversationId,
  setConversationId,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadConversations() {
    try {
      setLoading(true);

      const res = await client.rpc.conversations.$get();
      const data = await res.json();

      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Load conversations failed:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  /* ===============================
     NEW CHAT
  =============================== */
  async function handleNewChat() {
    try {
      const res = await client.rpc.conversations.$post();
      const data = await res.json();

      if (data?.id) {
        setConversationId(data.id);
        loadConversations();
      }
    } catch (error) {
      console.error("Create conversation failed:", error);
    }
  }

  /* ===============================
     DELETE
  =============================== */
  async function deleteConversation(id) {
    try {
      await client.rpc.conversations[":id"].$delete({
        param: { id },
      });

      if (conversationId === id) {
        setConversationId(null);
      }

      loadConversations();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  return (
    <div className="sidebar">
      <h3>Conversations</h3>

      <button
        className="new-chat-btn"
        onClick={handleNewChat}
      >
        + New Chat
      </button>

      {loading && <p>Loading...</p>}

      {!loading &&
        Array.isArray(conversations) &&
        conversations.map((conv) => (
          <div
            key={conv.id}
            className={`conversation-item ${
              conversationId === conv.id ? "active" : ""
            }`}
          >
            <span
              onClick={() =>
                setConversationId(conv.id)
              }
            >
              {conv.id.slice(0, 8)}
            </span>

            <button
              className="delete-btn"
              onClick={() =>
                deleteConversation(conv.id)
              }
            >
              ×
            </button>
          </div>
        ))}
    </div>
  );
}
