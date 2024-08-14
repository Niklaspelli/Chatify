import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const IncomingMessages = ({ token, id, username }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []); // Fetch all posts on component mount

  useEffect(() => {
    // Filter posts based on conversationId and username when conversationId or username changes
    filterPosts();
  }, [conversationId, posts, id]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched posts:", data); // Log the data to check its contents
      setPosts(data); // Set all posts initially
      setFilteredPosts(data); // Initially show all posts
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    if (!conversationId && !username) return;

    // Filter posts by both conversationId and username
    const filtered = posts.filter((post) => {
      const matchesConversation = conversationId
        ? post.conversationId === conversationId
        : true;
      const matchesUser = username
        ? post.senderId === username || post.userId === username
        : true;
      return matchesConversation && matchesUser;
    });

    console.log("Filtered posts:", filtered); // Log filtered posts
    setFilteredPosts(filtered); // Update state with filtered posts
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      // Remove deleted post from state
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error.message);
    }
  };

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
            <p className="username">
              {post.senderId === currentUserId ? "You" : post.userId}:
            </p>
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

  MessageList.propTypes = {
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        conversationId: PropTypes.string.isRequired,
        senderId: PropTypes.string.isRequired,
      })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <MessageList
          posts={filteredPosts}
          onDelete={handleDelete}
          currentUserId={username}
        />
      )}
    </div>
  );
};

IncomingMessages.propTypes = {
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default IncomingMessages;
