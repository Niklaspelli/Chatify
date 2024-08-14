import React from "react";
import PropTypes from "prop-types";

const MessageList = ({ posts, onDelete, currentUserId }) => {
  if (!posts || posts.length === 0) {
    return <p>No messages yet.</p>;
  }

  return (
    <div style={messageListStyle}>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            ...messageStyle,
            alignSelf:
              post.senderId === currentUserId ? "flex-end" : "flex-start",
            backgroundColor:
              post.senderId === currentUserId ? "#000000" : "#fff3e0",
            color: post.senderId === currentUserId ? "#ffffff" : "#000000",
          }}
        >
          <p className="username">
            {post.senderId === currentUserId ? "Du" : post.userId}:
          </p>
          <p className="message-text">{post.text}</p>
          <p>Skickat: {new Date(post.createdAt).toLocaleString()}</p>
          <p>Conversation ID: {post.conversationId}</p>
          <p>Message ID: {post.id}</p>
          {post.senderId === currentUserId && (
            <button onClick={() => onDelete(post.id)}>Radera</button>
          )}
        </div>
      ))}
    </div>
  );
};

const messageListStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowY: "auto",
  padding: "10px",
};

const messageStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "60%",
  margin: "5px",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  wordBreak: "break-word",
};

MessageList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired, // Corrected to match the provided API response
      text: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      conversationId: PropTypes.string.isRequired,
      senderId: PropTypes.string.isRequired, // Ensure this matches the API response
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default MessageList;
