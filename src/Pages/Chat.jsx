import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth"; // Adjust path as needed
import NewMessage from "./Message/NewMessage";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [username, setUsername] = useState(
    state?.username || localStorage.getItem("loggedInUsername")
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("loggedInUsername");

    if (storedToken && storedUsername && fakeAuth.isAuthenticated) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setUsername(storedUsername);
    } else {
      navigate("/login");
    }

    setLoading(false); // Ensure loading state is cleared
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>; // Display a loading state while checking authentication
  }

  return (
    <div>
      <h2>
        {username && (
          <p>
            Du är inloggad som:
            <span className="username">{username}</span>
          </p>
        )}
      </h2>
      {isAuthenticated && <NewMessage token={token} username={username} />}
    </div>
  );
};

export default Chat;

/* import React, { useEffect, useState } from "react";
import MessageSection from "./Message/MessageSection";

const Chat = () => {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("loggedInUserId");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setCurrentUser(Number(storedUserId)); // Ensure the userId is a number
    }
  }, []);

  if (!token || !currentUser) {
    return <p>Loading...</p>; // Or redirect to login
  }

  return <MessageSection token={token} currentUser={currentUser} />;
};

export default Chat;
 */
