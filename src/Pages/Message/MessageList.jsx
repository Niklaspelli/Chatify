/* import React from "react";

const MessageList = ({ posts, onDelete, username }) => {
  return (
    <div>
      {posts.map((post) => (
        <li key={post.id} className="message-border">
          <div className="username">{username}:</div>
          <p className="message-text">{post.text}</p>

          <p>Skrev: {new Date(post.createdAt).toLocaleString()}</p>
          <p>User ID: {post.userId}</p>
          <p>Message ID: {post.id}</p>
          <p>Conversation ID: {post.conversationId}</p>
          {/* Delete button without confirmation dialog */
/*        {post.userId && (
            <button onClick={() => onDelete(post.id)}>Delete</button>
          )}
          <hr />
        </li>
      ))}
    </div>
  );
};

export default MessageList; */

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
          <p className="username">{post.username}:</p>
          <p className="message-text">{post.text}</p>
          <p>Skrev: {new Date(post.createdAt).toLocaleString()}</p>
          <p>Conversation ID: {post.conversationId}</p>
          <p>Message ID: {post.id}</p>
          <button onClick={() => onDelete(post.id)}>Delete</button>
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
};

const messageStyle = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "60%",
  margin: "5px",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

export default MessageList;
