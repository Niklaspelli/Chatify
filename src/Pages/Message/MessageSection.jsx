import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";

const MessageSection = ({ token, username }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []); // Fetch all posts on component mount

  useEffect(() => {
    if (conversationId) {
      // Filter posts based on conversationId when conversationId changes
      filterPostsByConversationId(conversationId);
    } else {
      setFilteredPosts(posts); // Show all posts if no conversationId is provided
    }
  }, [conversationId, posts]);

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

  const filterPostsByConversationId = (id) => {
    if (!id) return; // If no conversationId is provided, do nothing

    const filtered = posts.filter((post) => post.conversationId === id);
    console.log("Filtered posts:", filtered); // Log filtered posts
    setFilteredPosts(filtered); // Update state with filtered posts
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
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }

      // Remove the post from the local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== msgID));
      setFilteredPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== msgID)
      );
      console.log(`Post with ID ${msgID} deleted successfully`);
    } catch (error) {
      setError(error.message);
      console.error("Error deleting post:", error.message);
    }
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
          username={username}
          currentUserId={username} // Pass the username as currentUserId if it's used for identification
        />
      )}
    </div>
  );
};

export default MessageSection;

/* import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";

const MessageSection = ({ token, username }) => {
  const [posts, setPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
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
      setPosts(data);
      // fetchUsers(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setIsLoading(false);
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
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }

      // Remove the post from the local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== msgID));
      console.log(`Post with ID ${msgID} deleted successfully`);
    } catch (error) {
      setError(error.message);
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <div>
      <h2>Message Section</h2>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <MessageList
          posts={posts}
          onDelete={handleDelete}
          username={username}
          currentUserId={username} // Pass the username as currentUserId if it's used for identification
        />
      )}
    </div>
  );
};

export default MessageSection; */
