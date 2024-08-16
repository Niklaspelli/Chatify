import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import { Container, Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

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
    <div style={LoginContainerStyle}>
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row className="justify-content-center w-100">
          <Col md={6} lg={4}>
            <div className="text-center mb-4">
              <h2>Logga in:</h2>
            </div>
            <label htmlFor="floatingInputCustom">Användarnamn:</label>
            <Form.Floating className="mb-1">
              <Form.Control
                id="floatingInputCustom"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ backgroundColor: "grey", color: "white" }}
                aria-label="Username"
                aria-required="true"
              />
            </Form.Floating>
            <label htmlFor="floatingInputCustom">Lösenord:</label>
            <Form.Floating className="mb-2" inline style={{ width: "400px" }}>
              <Form.Control
                id="floatingInputCustom"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mr-sm-5 centered-placeholder"
                style={{
                  backgroundColor: "grey",
                  color: "white",
                  width: "200px;",
                }}
                aria-label="Password"
                aria-required="true"
              />
            </Form.Floating>
            <div className="login-container">
              <Button
                style={{ backgroundColor: "black" }}
                className="login-button"
                type="submit"
                onClick={login}
                disabled={isLoading}
                aria-busy={isLoading ? "Loggar in..." : "Logga in"}
              >
                Logga in
              </Button>
              <Button
                style={{ backgroundColor: "black", margin: "20px" }}
                type="submit"
                onClick={() => navigate("/register")}
              >
                Skapa
              </Button>
            </div>
            {correctCredentials === false && (
              <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
                <span className="text-xs text-center">
                  Wrong username or password, try again!
                </span>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const LoginContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};

export default Login;
