import React, { useState, useEffect } from "react";
import IncomingMessages from "./IncomingMessages";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import DOMPurify from "dompurify";

const NewMessage = ({ token, id }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [conversationId, setConversationId] = useState(""); // State to hold conversationId
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyToMessageId, setReplyToMessageId] = useState(null); // State to track the message being replied to

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

      if (data.length > 0) {
        setConversationId(data[0].conversationId);
      }
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
      setCurrentUser(data[0]);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setError(null);

    const sanitizedText = DOMPurify.sanitize(newPostContent);

    if (!sanitizedText.trim()) {
      setError("Message content cannot be empty");
      return;
    }

    if (!conversationId.trim()) {
      setError("Conversation ID cannot be empty");
      return;
    }

    if (!currentUser) {
      setError("User information not available");
      return;
    }

    const payload = {
      text: sanitizedText,
      conversationId: conversationId,
      user: id,
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
      console.log("Created Post:", createdPost);
      setNewPostContent("");
      setReplyToMessageId(null);
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
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

  const handleReply = (messageId) => {
    setReplyToMessageId(messageId);

    const message = posts.find((post) => post.id === messageId);
    if (message) {
      setConversationId(message.conversationId);
    }
  };

  return (
    <div style={LoginContainerStyle}>
      <Container>
        {loading ? (
          <p>Laddar meddelanden...</p>
        ) : (
          <IncomingMessages
            posts={posts}
            token={token}
            onDelete={handleDelete}
            onReply={handleReply}
            id={id}
            users={users}
          />
        )}
        <h2>Svara:</h2>

        {error && <div style={{ color: "red" }}>Error: {error}</div>}
        <label>Fyll i ditt ConversationId för att starta chatten:</label>
        <Form.Floating className="mb-2" inline style={{ width: "400px" }}>
          <input
            type="text"
            placeholder="Conversation ID"
            value={conversationId}
            onChange={(e) => setConversationId(e.target.value)}
            disabled={sending}
          />
        </Form.Floating>
        <Form.Floating className="mb-2" inline style={{ width: "400px" }}>
          <textarea
            placeholder="Meddelande:"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            disabled={sending}
          ></textarea>
        </Form.Floating>
        <button onClick={handleCreatePost} disabled={sending}>
          {sending ? "Skickar..." : "Skicka"}
        </button>
      </Container>
    </div>
  );
};

const LoginContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};

export default NewMessage;
