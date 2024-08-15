import React from "react";

const MessageList = ({ posts, onDelete, currentUserId }) => {
  if (!posts || posts.length === 0) {
    return <p>No messages yet.</p>;
  }

  console.log("Rendering MessageList with posts:", posts); // Debugging statement

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
          <p className="username">{post.userId}:</p>
          <p className="message-text">{post.text}</p>
          <p>Sent: {new Date(post.createdAt).toLocaleString()}</p>
          <p>Conversation ID: {post.conversationId}</p>
          <p>Message ID: {post.id}</p>
          {post.senderId === currentUserId && (
            <button onClick={() => onDelete(post.id)}>Delete</button>
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

export default MessageList;
