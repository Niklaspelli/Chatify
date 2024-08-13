import React, { useState, useEffect } from "react";
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

/* #####################SENASTE#################################

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
      await fetchPosts(activeConversationId); // Fetch posts again after creating a new post
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
 */

/* import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";
import ChatPopup from "./ChatPopup";
import UserList from "./UserList";
import SearchBar from "../../Comp/Searchbar/Searchbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Function to show browser notifications
  const showNotification = (messageContent) => {
    if (Notification.permission === "granted") {
      new Notification("New message", {
        body: messageContent,
        icon: "/path-to-icon.png", // Optional
      });
    }
  };

  // Function to show in-app notifications
  const showUIMessageNotification = (messageContent) => {
    toast(messageContent);
  };

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

      // Check for new messages
      if (posts.length < data.length) {
        const newMessages = data.filter(
          (post) => !posts.some((p) => p.id === post.id)
        );
        newMessages.forEach((message) => {
          showNotification(message.text); // Show browser notification
          showUIMessageNotification(message.text); // Show in-app notification
        });
      }

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
      setFilteredUsers([]);
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
      await fetchPosts(activeConversationId); // Fetch posts again after creating a new post
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
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
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
      <ToastContainer />
    </div>
  );
};

NewMessage.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default NewMessage; */

/* import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserList from "./UserList";
import SearchBar from "../../Comp/Searchbar/Searchbar";
import Conversations from "./Conversations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BackendURL = "https://chatify-api.up.railway.app";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    (c === "x"
      ? Math.floor(Math.random() * 16)
      : Math.floor(Math.random() * 4) + 8
    ).toString(16)
  );
};

const NewMessage = ({ token, id }) => {
  // Change userId to id
  const [newPostContent, setNewPostContent] = useState("");
  const [conversations, setConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (messageContent) => {
    if (Notification.permission === "granted") {
      new Notification("New message", {
        body: messageContent,
        icon: "/path-to-icon.png",
      });
    }
  };

  const showUIMessageNotification = (messageContent) => {
    toast(messageContent);
  };

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
      const existingPosts = conversations[conversationId]?.posts || [];
      const newMessages = data.filter(
        (post) => !existingPosts.some((p) => p.id === post.id)
      );
      newMessages.forEach((message) => {
        showNotification(message.text);
        showUIMessageNotification(message.text);
      });
      setConversations((prevConvos) => ({
        ...prevConvos,
        [conversationId]: {
          ...prevConvos[conversationId],
          posts: data,
        },
      }));
    } catch (error) {
      setError("Failed to fetch posts. Please try again.");
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
      setFilteredUsers(data);
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

  const handleCreatePost = async (conversationId) => {
    setError(null);
    try {
      const body = JSON.stringify({
        text: newPostContent,
        conversationId,
        userId: id, // Use id instead of userId
      });

      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure token is correct
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
      setConversations((prevConvos) => ({
        ...prevConvos,
        [conversationId]: {
          ...prevConvos[conversationId],
          posts: [createdPost, ...(prevConvos[conversationId]?.posts || [])],
        },
      }));
    } catch (error) {
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

      setConversations((prevConvos) => ({
        ...prevConvos,
        [activeConversationId]: {
          ...prevConvos[activeConversationId],
          posts: prevConvos[activeConversationId]?.posts?.filter(
            (post) => post.id !== msgID
          ),
        },
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUserClick = (clickedUserId, username) => {
    let conversationId = sessionStorage.getItem(
      `conversation_${id}_${clickedUserId}` // Use id instead of userId
    );
    if (!conversationId) {
      conversationId = generateUUID();
      sessionStorage.setItem(
        `conversation_${id}_${clickedUserId}`,
        conversationId
      );
    }

    if (!conversations[conversationId]) {
      setConversations((prevConvos) => ({
        ...prevConvos,
        [conversationId]: { userId: clickedUserId },
      }));
    }

    sessionStorage.setItem("clicked_username", username);

    setActiveConversationId(conversationId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />ick
      <UserList users={filteredUsers} onUserClick={handleUserCl} />
      <Conversations
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationClick={setActiveConversationId}
        onCreatePost={handleCreatePost}
        onDeletePost={handleDelete}
        newPostContent={newPostContent}
        setNewPostContent={setNewPostContent}
        loading={loading}
        error={error}
        closeChat={() => setActiveConversationId(null)}
      />
      <ToastContainer />
    </div>
  );
};

NewMessage.propTypes = {
  token: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired, // Update PropTypes to use id
};

export default NewMessage; */
