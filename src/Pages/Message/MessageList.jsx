import React from "react";

const MessageList = ({ posts, onDelete, username }) => {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <p>{username}</p>
          <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
          <p>User ID: {post.userId}</p>
          <p>Conversation ID: {post.conversationId}</p>
          {/* Delete button without confirmation dialog */}
          {post.userId && (
            <button onClick={() => onDelete(post.id)}>Delete</button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
