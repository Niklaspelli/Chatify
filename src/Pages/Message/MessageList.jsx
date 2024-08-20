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
        const user = getUserById(post.userId);
        const isCurrentUser = user && user.userId === id;

        return (
          <div
            key={post.id}
            style={{
              display: "flex",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                backgroundColor: isCurrentUser
                  ? "rgb(133, 85, 171)"
                  : "#087d7f",
                color: isCurrentUser ? "white" : "white",
                padding: "10px",
                borderRadius: "10px",
                border: "5px solid white",
                maxWidth: "60%",
                boxShadow: "0 5px 6px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                flexDirection: isCurrentUser ? "row-reverse" : "row",
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

const messageListStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowY: "auto",
  padding: "10px",
  margin: "10px",
};

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
