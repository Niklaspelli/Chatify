/* import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import UserList from "./UserList";

const BackendURL = "https://chatify-api.up.railway.app";

const UserSearch = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

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
      setUsers(data); // Store all users
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
    setHasSearched(true);
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

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {hasSearched && (
        <>
          {filteredUsers.length === 0 ? (
            <div>No users found</div>
          ) : (
            <UserList users={filteredUsers} token={token} />
          )}
        </>
      )}
    </div>
  );
};

export default UserSearch;
 */
