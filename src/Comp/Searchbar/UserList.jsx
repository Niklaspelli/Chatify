import React from "react";
import Invite from "../../Pages/Message/Invite";

const UserList = ({ users, token }) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id} style={userStyle}>
          <span>{user.username}</span>
          <Invite id={user.userId} token={token} />{" "}
        </div>
      ))}
    </div>
  );
};

const userStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

export default UserList;
