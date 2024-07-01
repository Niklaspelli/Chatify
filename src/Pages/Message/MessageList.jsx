import React, { useCallback } from "react";

const MessageList = ({ posts, onDelete, currentUser, token }) => {
  const handleDelete = useCallback(
    async (msgId) => {
      try {
        console.log(`Attempting to delete message with id: ${msgId}`);
        const response = await fetch(
          `https://chatify-api.up.railway.app/messages/${msgId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          console.log(`Message with id: ${msgId} deleted successfully`);
          onDelete(msgId);
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
              <span className="username">{currentUser}</span> skrev:
            </p>

            <div className="chat-bg">
              <p>{post.text}</p>
              <p>{post.createdAt}</p>
            </div>

            {currentUser === post.userId && (
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            )}
          </li>
        ))}{" "}
      </ul>
    </div>
  );
};

export default MessageList;
