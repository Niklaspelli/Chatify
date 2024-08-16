import React from "react";

const MessageList = ({ posts, onDelete, currentUserId, users }) => {
  const getUserNameByUserId = (userId) => {
    const user = users.find((user) => user.userId === userId);
    return user ? user.username : "Unknown User";
  };

  const getUserAvatarByUserId = (userId) => {
    const user = users.find((user) => user.userId === userId);
    return user ? user.avatar : "https://i.pravatar.cc/200";
  };

  if (!posts || posts.length === 0) {
    return <p>No messages yet.</p>;
  }

  return (
    <div style={messageListStyle}>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            display: "flex",
            justifyContent:
              post.senderId === currentUserId ? "flex-start" : "flex-start",
          }}
        >
          <div
            style={{
              ...messageStyle,
              backgroundColor:
                post.senderId === currentUserId ? "#000000" : "#fff3e0",
              color: post.senderId === currentUserId ? "#ffffff" : "#000000",
              maxWidth: "60%",
            }}
          >
            <img
              src={getUserAvatarByUserId(post.userId)}
              alt="avatar"
              style={{ width: 50, height: 50, borderRadius: "50%" }}
            />
            <p className="username">{getUserNameByUserId(post.userId)}:</p>
            <p>{post.text}</p>
            <p style={{ fontSize: "0.8em", color: "#999" }}>
              Sent: {new Date(post.createdAt).toLocaleString()}
            </p>
            <p style={{ fontSize: "0.8em", color: "#999" }}>
              Conversation ID: {post.conversationId}
            </p>
            <p style={{ fontSize: "0.8em", color: "#999" }}>
              Message ID: {post.id}
            </p>
            {post.senderId === currentUserId && (
              <button
                onClick={() => onDelete(post.id)}
                style={{ marginTop: "10px" }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Styles for the message list container
const messageListStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowY: "auto",
  padding: "10px",
  margin: "10px",
};

// Styles for individual messages
const messageStyle = {
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  wordBreak: "break-word",
};

export default MessageList;
