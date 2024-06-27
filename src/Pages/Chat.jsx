import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import NewMessage from "./Message/NewMessage";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState(username || "");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedUsername = localStorage.getItem("loggedInUsername");
    const isAuthenticated = location.state?.isAuthenticated;

    if (!token || !storedUsername) {
      navigate("/login");
      return;
    }

    setIsAuthenticated(fakeAuth.isAuthenticated);
    setLoggedInUsername(storedUsername || "");
    setToken(localStorage.getItem("token"));
  }, [navigate, location.state, token]);

  return (
    <>
      <h2>Welcome to the Chat!</h2>
      {loggedInUsername && <p>Welcome, {loggedInUsername}!</p>}
      <NewMessage token={token} currentUser={loggedInUsername} />{" "}
      {/* Pass currentUser here */}
    </>
  );
};

export default Chat;
