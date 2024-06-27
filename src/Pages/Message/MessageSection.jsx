import React, { useState, useEffect } from "react";
import NewMessage from "./Message/NewMessage";
import MessageList from "./Message/MessageList";

const MessageSection = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <NewMessage token={token} refreshPosts={fetchPosts} />
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <MessageList posts={posts} />
      )}
    </div>
  );
};

export default MessageSection;
