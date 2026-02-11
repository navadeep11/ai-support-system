import React from "react";

function MessageBubble({ message }) {
  return (
    <div
      className={`message ${
        message.role === "user" ? "user-message" : "assistant-message"
      }`}
    >
      {message.content}
    </div>
  );
}

export default MessageBubble;
