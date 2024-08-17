/* import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NewMessage from "./NewMessage";
import Modal from "react-modal";

const BackendURL = "https://chatify-api.up.railway.app";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
    (c === "x"
      ? Math.floor(Math.random() * 16)
      : Math.floor(Math.random() * 4) + 8
    ).toString(16)
  );
};

const Conversation = ({ token, username, userId }) => {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(generateUUID());
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BackendURL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setError(`Failed to fetch messages: ${error.message}`);
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

  const startConversation = async (conversationId) => {
    try {
      const response = await fetch(`${BackendURL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          conversationId,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to start conversation: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Error data from server:", errorData);
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
        } catch (jsonError) {
          console.error("Failed to parse error response JSON:", jsonError);
          errorMessage += " - Unable to parse error response.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Received data:", data);
      setConversationId(data.conversationId); // Use conversationId from the response
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
      console.error("Error details:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
      fetchUsers();
    }
  }, [token]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    startConversation(user.id); // Assuming user.id represents the recipientId
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <h2>Start a new conversation</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user)}>
            {user.username}
          </li>
        ))}
      </ul>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Chat Modal"
      >
        {conversationId && (
          <NewMessage
            token={token}
            username={username}
            userId={userId}
            conversationId={conversationId}
            messages={messages}
            setMessages={setMessages}
          />
        )}
        <button onClick={() => setIsModalOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

Conversation.propTypes = {
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Conversation;
 */

/* import React from "react";
import PropTypes from "prop-types";
import ChatPopup from "./ChatPopup";

const Conversations = ({
  conversations,
  activeConversationId,
  onConversationClick,
  onCreatePost,
  onDeletePost,
  newPostContent,
  setNewPostContent,
  loading,
  error,
  closeChat,
}) => {
  return (
    <div className="conversations">
      <div className="conversation-list">
        {Object.keys(conversations).map((convoId) => (
          <div
            key={convoId}
            className={`conversation-item ${
              convoId === activeConversationId ? "active" : ""
            }`}
            onClick={() => onConversationClick(convoId)}
          >
            {conversations[convoId].userId}
          </div>
        ))}
      </div>
      {activeConversationId && (
        <ChatPopup
          posts={conversations[activeConversationId].posts || []}
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
          handleCreatePost={() => onCreatePost(activeConversationId)}
          handleDelete={onDeletePost}
          loading={loading}
          error={error}
          closeChat={closeChat}
        />
      )}
    </div>
  );
};

Conversations.propTypes = {
  conversations: PropTypes.object.isRequired,
  activeConversationId: PropTypes.string,
  onConversationClick: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired,
  newPostContent: PropTypes.string.isRequired,
  setNewPostContent: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  closeChat: PropTypes.func.isRequired,
};

export default Conversations;
 */
