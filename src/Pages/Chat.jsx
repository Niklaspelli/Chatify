import { useEffect, useState } from "react";
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
      navigate("/login");
      return;
    }

    setIsAuthenticated(fakeAuth.isAuthenticated);
    setCurrentUser(storedUsername);
    setToken(storedToken);
  }, [navigate]);

  return (
    <>
      <h2>
        {currentUser && (
          <p>
            Välkommen till Chatten:
            <div className="username"> {currentUser}</div>
          </p>
        )}
      </h2>
      <p>Ser du det här, då är du inne innanför protectedroute</p>
      <NewMessage token={token} currentUser={currentUser} />
    </>
  );
};

export default Chat;
