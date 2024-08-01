// UserList.jsx
import React from "react";
import PropTypes from "prop-types";

const UserList = ({ users, onUserClick }) => {
  if (users.length === 0) {
    return <div>No users found</div>; // Optionally show a message if no users are found
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onClick={() => onUserClick(user.id)}>
          {user.username}
        </li>
      ))}
    </ul>
  );
};

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onUserClick: PropTypes.func.isRequired,
};

export default UserList;
