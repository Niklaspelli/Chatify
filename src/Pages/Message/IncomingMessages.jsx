import React, { useState } from "react";
import MessageList from "./MessageList";

const IncomingMessages = ({ token, currentUserId, id, users }) => {
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchMessages = async () => {
    if (!conversationId) {
      alert("Please enter a conversation ID");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched messages:", data);
      setMessages(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch messages:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMessage = async (postId) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.statusText}`);
      }

      setMessages(messages.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete message:", error.message);
    }
  };

  return (
    <div>
      <h2 style={{ margin: "20px" }}>Hämta din chatt med ConversationId</h2>
      <input
        type="text"
        placeholder="Enter conversation ID"
        value={conversationId}
        onChange={(e) => setConversationId(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleFetchMessages}>Hämta chatt</button>

      {isLoading && <p>Loading messages...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && !error && messages.length === 0 && (
        <p style={{ margin: "20px" }}>
          No messages found for this conversation ID.
        </p>
      )}

      {!isLoading && messages.length > 0 && (
        <MessageList
          posts={messages}
          onDelete={handleDeleteMessage}
          id={id}
          users={users}
        />
      )}
    </div>
  );
};

const inputStyle = {
  width: "100%",
  maxWidth: "400px",
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
};

export default IncomingMessages;
