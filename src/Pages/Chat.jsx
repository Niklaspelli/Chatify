import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import SearchBar from "../Comp/Searchbar/SearchBar";
import UserList from "../Comp/Searchbar/UserList";
import NewMessage from "./Message/NewMessage";
import Invitations from "../Comp/Invitations";

const BackendURL = "https://chatify-api.up.railway.app";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateUsername = location.state?.username || "";
  const stateId = location.state?.id || "";

  const [username, setUsername] = useState(
    stateUsername || localStorage.getItem("loggedInUsername") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [id, setId] = useState(stateId || localStorage.getItem("Id") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (token && id && fakeAuth.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };

    verifyAuthentication();
  }, [token, id, navigate]);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError("No authentication token provided");
      setLoading(false);
    }
  }, [token]);

  const handleSearch = (query) => {
    setHasSearched(true);
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered.length ? filtered : []);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  const handleConversationChange = (conversationId) => {
    setSelectedConversationId(conversationId);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {username && (
        <h2>
          <p>
            Du är inloggad som:
            <span className="username">{username}</span>
          </p>
        </h2>
      )}

      <SearchBar onSearch={handleSearch} />
      {hasSearched &&
        (filteredUsers.length === 0 ? (
          <p>Inga användare hittade</p>
        ) : (
          <UserList users={filteredUsers} token={token} />
        ))}
      <Invitations token={token} id={id} />
      {isAuthenticated && (
        <>
          <NewMessage
            token={token}
            id={id}
            conversationId={selectedConversationId}
            onNewMessage={handleNewMessage}
          />
        </>
      )}
      {error && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Chat;
