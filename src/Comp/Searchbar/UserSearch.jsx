import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import UserList from "./UserList"; // A component to display the list of users

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Fetch the users from an API or other source
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://your-api-url/users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Initialize with all users
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Show all users if the query is empty
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <UserList users={filteredUsers} />
    </div>
  );
};

export default UserSearch;
