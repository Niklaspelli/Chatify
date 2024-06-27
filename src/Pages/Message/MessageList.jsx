import React, { useCallback } from "react";

const MessageList = ({ posts, onDelete, currentUser, token }) => {
  const handleDelete = useCallback(
    async (postId) => {
      try {
        const response = await fetch(
          `https://chatify-api.up.railway.app/messages/${postId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          onDelete(postId);
        } else {
          console.error("Failed to delete post, status code:", response.status);
          const errorData = await response.json();
          console.error("Error message:", errorData.error);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    [onDelete, token]
  );

  return (
    <div>
      <h2>All Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="message-border">
            <p>
              <span className="username">{post.author}</span> skrev:
            </p>

            <div className="chat-bg">
              <p>{post.text}</p>
            </div>

            {currentUser === post.author && (
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
