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
/* import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";

const BackendURL = "https://chatify-api.up.railway.app";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    (c === "x"
      ? Math.floor(Math.random() * 16)
      : Math.floor(Math.random() * 4) + 8
    ).toString(16)
  );
};

const NewMessage = ({ token, username, userId }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(generateUUID());

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
  }, [token, conversationId, userId]);

  const handleCreatePost = async () => {
    setError(null);
    try {
      const body = JSON.stringify({
        text: newPostContent,
        conversationId,
        userId, // Include userId in the request body
      });

      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.message || response.statusText}`
        );
      }

      console.log("Request Body:", body);

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
      const response = await fetch(`${BackendURL}/messages/${msgID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  userId: PropTypes.string.isRequired, // Add userId to propTypes validation
};

export default NewMessage; */

/* import React, { useState } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";

const BackendURL = "https://chatify-api.up.railway.app";

const NewMessage = ({
  token,
  username,
  userId,
  conversationId,
  messages,
  setMessages,
}) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    setError(null);
    try {
      const body = JSON.stringify({
        text: newPostContent,
        conversationId,
        userId,
      });

      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.message || response.statusText}`
        );
      }

      console.log("Request Body:", body);

      const createdPost = await response.json();
      console.log("Post created successfully:", createdPost);
      setNewPostContent("");
      setMessages([createdPost, ...messages]);
    } catch (error) {
      console.error("Failed to create post:", error.message);
      setError(`Failed to create post: ${error.message}`);
    }
  };

  const handleDelete = async (msgID) => {
    try {
      const response = await fetch(`${BackendURL}/messages/${msgID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setMessages(messages.filter((post) => post.id !== msgID));
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
          posts={messages}
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
  userId: PropTypes.string.isRequired,
  conversationId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
};

export default NewMessage; */

/* import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";

const BackendURL = "https://chatify-api.up.railway.app";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    (c === "x"
      ? Math.floor(Math.random() * 16)
      : Math.floor(Math.random() * 4) + 8
    ).toString(16)
  );
};

const NewMessage = ({ token, username, userId }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(generateUUID());

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

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BackendURL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(`Failed to fetch users: ${error.message}`);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token, conversationId, userId]);

  const handleCreatePost = async () => {
    setError(null);
    try {
      const body = JSON.stringify({
        text: newPostContent,
        conversationId,
        userId, // Include userId in the request body
      });

      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.message || response.statusText}`
        );
      }

      console.log("Request Body:", body);

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
      const response = await fetch(`${BackendURL}/messages/${msgID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  userId: PropTypes.string.isRequired, // Add userId to propTypes validation
};

export default NewMessage; */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";
import ChatPopup from "./ChatPopup";
import UserList from "./UserList";
import SearchBar from "../../Comp/Searchbar/Searchbar";

const BackendURL = "https://chatify-api.up.railway.app";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    (c === "x"
      ? Math.floor(Math.random() * 16)
      : Math.floor(Math.random() * 4) + 8
    ).toString(16)
  );
};

const NewMessage = ({ token, userId }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // Initialize with an empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);

  // Fetch messages for the current conversation
  const fetchPosts = async (conversationId) => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BackendURL}/messages?conversationId=${conversationId}`,
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
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error.message);
      setError("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users list
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BackendURL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers([]); // Ensure filteredUsers is empty initially
    } catch (error) {
      setError(`Failed to fetch users: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (activeConversationId) {
      fetchPosts(activeConversationId);
    }
  }, [activeConversationId]);

  const handleCreatePost = async () => {
    setError(null);
    try {
      const body = JSON.stringify({
        text: newPostContent,
        conversationId: activeConversationId,
        userId,
      });

      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create post: ${errorData.message || response.statusText}`
        );
      }

      const createdPost = await response.json();
      setNewPostContent("");
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
    } catch (error) {
      console.error("Failed to create post:", error.message);
      setError(`Failed to create post: ${error.message}`);
    }
  };

  const handleDelete = async (msgID) => {
    try {
      const response = await fetch(`${BackendURL}/messages/${msgID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== msgID));
    } catch (error) {
      setError(error.message);
      console.error("Error deleting post:", error.message);
    }
  };

  const handleUserClick = (clickedUserId) => {
    let conversationId = sessionStorage.getItem(
      `conversation_${userId}_${clickedUserId}`
    );
    if (!conversationId) {
      conversationId = generateUUID();
      sessionStorage.setItem(
        `conversation_${userId}_${clickedUserId}`,
        conversationId
      );
    }
    setActiveConversationId(conversationId);
    setShowChatPopup(true);
  };

  // Function to handle search input and filter users
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered); // Update filtered users
    } else {
      setFilteredUsers([]); // Ensure no users are shown when query is empty
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <UserList users={filteredUsers} onUserClick={handleUserClick} />
      {showChatPopup && activeConversationId && (
        <ChatPopup
          posts={posts}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          handleCreatePost={handleCreatePost}
          handleDelete={handleDelete}
          loading={loading}
          error={error}
          closeChat={() => setShowChatPopup(false)}
        />
      )}
    </div>
  );
};

NewMessage.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default NewMessage;
