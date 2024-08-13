import React from "react";
import PropTypes from "prop-types";
import Invite from "../../Pages/Message/Invite";

const UserList = ({ users, token }) => {
  if (users.length === 0) {
    return <p>No users found</p>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} style={userStyle}>
          <span>{user.username}</span>
          <Invite id={user.userId} token={token} />
        </div>
      ))}
    </div>
  );
};

// Example styles for user list items
const userStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  token: PropTypes.string.isRequired,
};

export default UserList;
