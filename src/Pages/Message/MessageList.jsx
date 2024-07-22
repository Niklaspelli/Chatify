import React from "react";

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
          {/* Delete button without confirmation dialog */}
          {post.userId && (
            <button onClick={() => onDelete(post.id)}>Delete</button>
          )}
          <hr />
        </li>
      ))}
    </div>
  );
};

export default MessageList;
