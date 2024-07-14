import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth"; // Adjust the path based on your project structure
import NewMessage from "./Message/NewMessage";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { username } = location.state || {};

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(username || "");

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    const authenticated = fakeAuth.isAuthenticated;

    if (!storedUsername || !authenticated) {
      navigate("/login"); // Redirect to login page if not authenticated
      return;
    }

    setIsAuthenticated(authenticated);
    setCurrentUser(storedUsername);
  }, [navigate]);

  return (
    <>
      <h2>
        {currentUser && (
          <p>
            Du är inloggad som:
            <div className="username">{currentUser}</div>
          </p>
        )}
      </h2>
      {isAuthenticated && (
        <NewMessage
          token={localStorage.getItem("token")}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default Chat;
