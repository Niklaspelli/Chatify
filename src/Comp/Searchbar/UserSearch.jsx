import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import UserList from "./UserList";

const BackendURL = "https://chatify-api.up.railway.app";

const UserSearch = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Show all users if query is empty
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <UserList users={filteredUsers} token={token} /> {/* Pass token here */}
    </div>
  );
};

export default UserSearch;
