import React, { useState, useEffect } from "react";
import MessageList from "./MessageList.jsx";

const NewMessage = ({ token, currentUser }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized access. Please log in again.");
        }
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleCreatePost = async () => {
    setError(null);
    try {
      const payload = {
        text: newPostContent,
        conversationId: "", // Ensure this is the correct ID format
      };

      console.log("Sending payload:", payload);

      const response = await fetch(
        `https://chatify-api.up.railway.app/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        if (response.status === 400) {
          throw new Error(errorData.error || "Content is required");
        }
        throw new Error("Failed to create post");
      }

      const createdPost = await response.json();
      console.log("Post created successfully:", createdPost);
      setNewPostContent("");
      setPosts([createdPost, ...posts]);
    } catch (error) {
      console.error("Failed to create post:", error.message);
      setError(error.message);
    }
  };

  const handleDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  return (
    <div>
      <h2>Send a message!</h2>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      <textarea
        placeholder="Message:"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      ></textarea>
      <button onClick={handleCreatePost}>Send</button>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <MessageList
          posts={posts}
          onDelete={handleDelete}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default NewMessage;
