/* import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";

const NewMessage = ({ token, username }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // State to hold current user info
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, [token]);

  const fetchPosts = async () => {
    setLoading(true);
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
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      // Assuming the first user in the list is the current user
      setCurrentUser(data[0]); // Adjust this based on your actual user identification logic
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setError(null);
    if (!newPostContent.trim()) {
      setError("Message content cannot be empty");
      return;
    }

    if (!currentUser) {
      setError("User information not available");
      return;
    }

    const payload = {
      text: newPostContent,
      user: username, // Assuming currentUser has a username property
    };

    setSending(true);
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      const createdPost = await response.json();
      setNewPostContent("");
      setPosts([createdPost, ...posts]);
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (msgID) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages/${msgID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((post) => post.id !== msgID));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <div>
      <h2>Send a message!</h2>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <textarea
        placeholder="Message:"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        disabled={sending}
      ></textarea>
      <button onClick={handleCreatePost} disabled={sending}>
        {sending ? "Sending..." : "Send"}
      </button>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <MessageList
          posts={posts}
          onDelete={handleDelete}
          username={username}
        />
      )}
    </div>
  );
};

export default NewMessage;
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";

const BackendURL = "https://chatify-api.up.railway.app";

const NewMessage = ({ token, username }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BackendURL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is included
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
      setError("Failed to fetch posts. Please check your token and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]); // Fetch posts when token changes

  const handleCreatePost = async () => {
    setError(null);
    try {
      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure the token is included
        },
        body: JSON.stringify({
          text: newPostContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.message || response.statusText}`
        );
      }

      const createdPost = await response.json();
      console.log("Post created successfully:", createdPost);
      setNewPostContent("");
      setPosts([createdPost, ...posts]);
    } catch (error) {
      console.error("Failed to create post:", error.message);
      setError(`Failed to create post: ${error.message}`);
    }
  };

  const handleDelete = async (msgID) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/messages/${msgID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts(posts.filter((post) => post.id !== msgID));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <textarea
        placeholder="Message:"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      ></textarea>
      <button onClick={handleCreatePost} disabled={!newPostContent}>
        Create Post
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <MessageList
          posts={posts}
          onDelete={handleDelete}
          username={username}
        />
      )}
    </div>
  );
};

NewMessage.propTypes = {
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default NewMessage;
