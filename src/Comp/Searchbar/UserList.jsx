import React from "react";
import Invite from "../../Pages/Message/Invite";
import { alignJustify } from "fontawesome";

const UserList = ({ users, token }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id || user.userId} style={userStyle}>
          <span>{user.username}</span>
          <Invite id={user.userId} token={token} />
        </div>
      ))}
    </div>
  );
};
const userStyle = {
  display: "inline",
  position: "relative",
  left: "50%",
  justifyContent: "center",
  marginBottom: "10px",
};

export default UserList;
