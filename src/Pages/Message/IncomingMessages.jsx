import React, { useState } from "react";
import MessageList from "./MessageList"; // Ensure this component handles the 'currentUserId' prop

const IncomingMessages = ({ token, currentUserId, id }) => {
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

      // Remove deleted message from state
      setMessages(messages.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete message:", error.message);
    }
  };

  return (
    <div>
      <h2>Hämta din chatt med ConversationId :)</h2>
      <input
        type="text"
        placeholder="Enter conversation ID"
        value={conversationId}
        onChange={(e) => setConversationId(e.target.value)}
      />
      <button onClick={handleFetchMessages}>Hämta chatt</button>

      {isLoading && <p>Loading messages...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && !error && messages.length === 0 && (
        <p>No messages found for this conversation ID.</p>
      )}

      {!isLoading && messages.length > 0 && (
        <MessageList
          posts={messages}
          onDelete={handleDeleteMessage} // Pass the delete handler
          currentUserId={currentUserId}
          id={id} // Pass the current user ID
        />
      )}
    </div>
  );
};

export default IncomingMessages;
