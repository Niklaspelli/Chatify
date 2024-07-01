import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import NewMessage from "./Message/NewMessage";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(username || "");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    const storedToken = localStorage.getItem("token");

    if (!storedToken || !storedUsername) {
      navigate("/Register");
      return;
    }

    if (username) {
      setCurrentUser(username);
    } else {
      setCurrentUser(storedUsername);
    }

    setToken(storedToken);

    if (fakeAuth.isAuthenticated) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate, username]);

  return (
    <>
      <h2>
        {currentUser && (
          <p>
            Du är inloggad som:
            <span className="username"> {currentUser}</span>
          </p>
        )}
      </h2>
      <NewMessage token={token} currentUser={currentUser} />{" "}
      {/* Pass token and currentUser as props */}
    </>
  );
};

export default Chat;
