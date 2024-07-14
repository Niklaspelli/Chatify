import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";

const MessageSection = ({ token, currentUser }) => {
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
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data);
      fetchUsers(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (posts) => {
    try {
      const userIds = [...new Set(posts.map((post) => post.userId))];
      const users = {};
      await Promise.all(
        userIds.map(async (userId) => {
          const response = await fetch(
            `https://chatify-api.up.railway.app/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch user with userId: ${userId}`);
          }
          const userData = await response.json();
          users[userId] = userData;
        })
      );
      setUsersMap(users);
    } catch (error) {
      console.error("Error fetching users:", error.message);
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
      <h2>Message Section</h2>
      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <MessageList
          posts={posts}
          usersMap={usersMap}
          onDelete={handleDelete}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default MessageSection;
