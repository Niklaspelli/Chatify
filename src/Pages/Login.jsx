import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [correctCredentials, setCorrectCredentials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error.message);
    }
  };

  const login = async () => {
    setCorrectCredentials(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            username: username,
            password: password,
            csrfToken: csrfToken,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      const token = data.token;
      const loggedInUsername = data.username;
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUsername", loggedInUsername);
      fakeAuth.signIn(() => {
        setCorrectCredentials(true);
        navigate("/chat", { state: { username: loggedInUsername } });
      });
    } catch (error) {
      setCorrectCredentials(false);
      console.error("Login failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign in!</h2>
      <label>Username:</label>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login} disabled={isLoading}>
        Sign in
      </button>
      {correctCredentials === false && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">
            Wrong username or password, try again!
          </span>
        </div>
      )}
      {isLoading && <div>Loading...</div>}
      <Link to="/register">Register</Link>
    </div>
  );
};

export default Login;
