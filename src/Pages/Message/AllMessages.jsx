import React, { useEffect, useState } from "react";

const AllMessages = ({ token, userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://chatify-api.up.railway.app/messages?userId=${userId}`, // Use the dynamic userId
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(`Fetching messages for userId: ${userId}`); // Debugging
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debugging
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }
        setMessages(data); // Assuming the API returns messages directly
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token, userId]); // Dependency array includes both token and userId

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (error) {
    return <p>Error fetching messages: {error}</p>;
  }

  return (
    <div>
      <h1>Messages from User {userId}</h1> {/* Adjusted the heading */}
      <ul>
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.id}>
              {message.text} userId: {message.userId}
            </li>
          ))
        ) : (
          <li>No messages found</li>
        )}
      </ul>
    </div>
  );
};

export default AllMessages;
