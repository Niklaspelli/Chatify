/* import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";

const csrf = import.meta.env.VITE_API_CSRF;
const authToken = import.meta.env.VITE_AUTH_TOKEN;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [correctCredentials, setCorrectCredentials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(csrf, {
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
    if (!username || !password) {
      setCorrectCredentials(false);
      return;
    }

    setCorrectCredentials(null);
    setIsLoading(true);

    try {
      const response = await fetch(authToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          username,
          password,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const token = data.token;
      const userId = data.userId; // Ensure userId is included in the response

      // Store the token and userId in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUserId", userId);

      // Optionally, store other user info (e.g., username)
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const loggedInUsername = decodedToken.user;
      localStorage.setItem("loggedInUsername", loggedInUsername);

      // Simulate authentication using fakeAuth
      fakeAuth.signIn(() => {
        setCorrectCredentials(true);
        navigate("/chat", { state: { username: loggedInUsername, userId } });
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
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-label="Username"
        aria-required="true"
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
        aria-required="true"
      />
      <button onClick={login} disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      {correctCredentials === false && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">
            Wrong username or password, try again!
          </span>
        </div>
      )}
      <Link to="/register">Register</Link>
    </div>
  );
};

export default Login; */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";

const csrf = import.meta.env.VITE_API_CSRF;
const authToken = import.meta.env.VITE_AUTH_TOKEN;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [correctCredentials, setCorrectCredentials] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(csrf, {
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
    if (!username || !password) {
      setCorrectCredentials(false);
      return;
    }

    setCorrectCredentials(null);
    setIsLoading(true);

    try {
      const response = await fetch(authToken, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          username,
          password,
          csrfToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const token = data.token;

      // Decode the JWT token payload
      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      // Log the entire decoded token payload for debugging
      console.log("Decoded Token Payload:", decodedToken);

      // Extract the ID from the decoded token
      const id = decodedToken.id;

      console.log("Token:", token);
      console.log("Id:", id);

      // Store the token and userId in local storage
      localStorage.setItem("Id", id);
      localStorage.setItem("token", token);

      // Optionally, store other user info (e.g., username)
      const loggedInUsername = decodedToken.user;
      localStorage.setItem("loggedInUsername", loggedInUsername);

      // Simulate authentication using fakeAuth
      fakeAuth.signIn(() => {
        setCorrectCredentials(true);
        navigate("/chat", { state: { username: loggedInUsername, id } });
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
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-label="Username"
        aria-required="true"
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
        aria-required="true"
      />
      <button onClick={login} disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
      {correctCredentials === false && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">
            Wrong username or password, try again!
          </span>
        </div>
      )}
      <Link to="/register">Register</Link>
    </div>
  );
};

export default Login;
