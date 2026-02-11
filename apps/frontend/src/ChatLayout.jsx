import { useState } from "react";
import Sidebar from "./components/sidebar";
import ChatBox from "./components/ChatBox";
import "./styles/chat.css";

export default function ChatLayout() {
  const [conversationId, setConversationId] = useState(null);

  return (
    <div className="chat-container">
      <Sidebar
        conversationId={conversationId}
        setConversationId={setConversationId}
      />

      <ChatBox
        conversationId={conversationId}
        setConversationId={setConversationId}
      />
    </div>
  );
}
