import React from "react";
import PropTypes from "prop-types";
import Invite from "../../Pages/Message/Invite";

const UserList = ({ users, token }) => {
  // Render nothing if the users list is empty
  if (users.length === 0) {
    return null;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} style={userStyle}>
          <span>{user.username}</span>
          <Invite id={user.userId} token={token} />{" "}
          {/* Ensure 'id' is correct */}
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
      id: PropTypes.string.isRequired, // Ensure 'id' is correct
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  token: PropTypes.string.isRequired,
};

export default UserList;
