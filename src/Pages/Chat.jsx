/* import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import NewMessage from "./Message/NewMessage";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state with data from location or localStorage
  const [username, setUsername] = useState(
    location.state?.username || localStorage.getItem("loggedInUsername")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // Add state for userId
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("loggedInUsername");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUsername && fakeAuth.isAuthenticated) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setUsername(storedUsername);
      setUserId(storedUserId); // Set userId from localStorage
    } else {
      navigate("/login");
    }

    setLoading(false); // Ensure loading state is cleared
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>; // Display a loading state while checking authentication
  }

  const handleNavigateToProfile = () => {
    navigate("/profile", { state: { token, userId } });
  };

  return (
    <div>
      <h2>
        {username && (
          <p>
            Du är inloggad som:
            <span className="username">{username}</span>
          </p>
        )}
      </h2>
      {isAuthenticated && <NewMessage token={token} userId={userId} />}
      <button onClick={handleNavigateToProfile}>Go to Profile</button>
    </div>
  );
};

export default Chat;
 */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import SearchBar from "../Comp/Searchbar/SearchBar";
import UserList from "../Comp/Searchbar/UserList";
import NewMessage from "./Message/NewMessage";
import Invite from "./Message/Invite";

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
  const [users, setUsers] = useState([]); // Maintain the full list of users

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
        setFilteredUsers(data); // Initialize filtered users with all users
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
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered.length ? filtered : []); // Show empty array if no matches
    } else {
      setFilteredUsers(users); // Reset to show all users if query is empty
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {username && (
        <h2>
          <p>
            You are logged in as:
            <span className="username">{username}</span>
          </p>
        </h2>
      )}
      <SearchBar onSearch={handleSearch} />
      {filteredUsers.length === 0 ? (
        <p>No users found</p> // Display a message when there are no users
      ) : (
        <UserList users={filteredUsers} token={token} id={id} /> // Pass filtered users
      )}
      {isAuthenticated && <NewMessage token={token} id={id} />}
      {error && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">{error}</span>
        </div>
      )}

      {/* Example usage of Invite component */}
      {users.map((user) => {
        /*  console.log("User ID:", user.userId); // Log the ID being passed */
        return <Invite key={user.userId} id={user.userId} token={token} />;
      })}
    </div>
  );
};

export default Chat;
