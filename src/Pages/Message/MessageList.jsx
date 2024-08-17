import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const MessageList = ({ posts, onDelete, id, users }) => {
  const getUserById = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  const UserNameId = (userId) => {
    const user = getUserById(userId);
    return user ? user.username : "Unknown User";
  };

  const AvatarId = (userId) => {
    const user = getUserById(userId);
    return user ? user.avatar : "https://i.pravatar.cc/200";
  };

  if (!posts || posts.length === 0) {
    return <p>No messages yet.</p>;
  }

  return (
    <div style={messageListStyle}>
      {posts.map((post) => {
        const user = getUserById(post.userId); // Get user object for the post
        const isCurrentUser = user && user.userId === id;

        return (
          <div
            key={post.id}
            style={{
              display: "flex",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start", // Aligns the entire box based on sender
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: isCurrentUser ? "grey" : "black", // Different color for current user
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%", // Restrict width of message box
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add shadow for depth
                display: "flex",
                alignItems: "center", // Center items vertically
                flexDirection: isCurrentUser ? "row-reverse" : "row", // Switch direction for avatar
              }}
            >
              <img
                src={AvatarId(post.userId)}
                alt="avatar"
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginLeft: isCurrentUser ? "10px" : "0",
                  marginRight: !isCurrentUser ? "10px" : "0",
                }}
              />
              <div>
                <p
                  className="username"
                  style={{ margin: 0, fontWeight: "bold" }}
                >
                  {UserNameId(post.userId)}
                </p>
                <p style={{ margin: "5px 0" }}>{post.text}</p>
                <p style={{ fontSize: "0.8em", color: "white" }}>
                  Sent: {new Date(post.createdAt).toLocaleString()}
                </p>
                <p style={{ fontSize: "0.8em", color: "#999" }}>
                  Conversation ID: {post.conversationId}
                </p>
                <p style={{ fontSize: "0.8em", color: "#999" }}>
                  Message ID: {post.id}
                </p>
                {isCurrentUser && (
                  <button
                    onClick={() => onDelete(post.id)}
                    style={deleteButtonStyle}
                    aria-label="Delete"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
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

// Styles for the delete button
const deleteButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "5px",
  marginTop: "10px",
  color: "white",
  fontSize: "20px",
};

export default MessageList;
