import React from "react";
import PropTypes from "prop-types";

const UserList = ({ users, onUserClick }) => {
  return (
    <div>
      <h3>Användare:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onUserClick(user.id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  onUserClick: PropTypes.func.isRequired,
};

export default UserList;
