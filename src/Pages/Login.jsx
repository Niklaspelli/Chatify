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

      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      console.log("Decoded Token Payload:", decodedToken);

      const id = decodedToken.id;

      console.log("Token:", token);
      console.log("Id:", id);

      localStorage.setItem("Id", id);
      localStorage.setItem("token", token);

      const loggedInUsername = decodedToken.user;
      localStorage.setItem("loggedInUsername", loggedInUsername);

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
      <div className="container">
        <Container>
          <Row className="justify-content-center w-100">
            <Col md={6} lg={4} className="justify-content-center">
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
                  style={{ backgroundColor: "185bac", color: "white" }}
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
                    backgroundColor: "185bac",
                    color: "white",
                    width: "200px;",
                  }}
                  aria-label="Password"
                  aria-required="true"
                />
              </Form.Floating>
              <div className="login-container">
                <Button
                  style={{ backgroundColor: "#185bac" }}
                  className="login-button"
                  type="submit"
                  onClick={login}
                  disabled={isLoading}
                  aria-busy={isLoading ? "Loggar in..." : "Logga in"}
                >
                  Logga in
                </Button>
                <Button
                  style={{ backgroundColor: "#185bac", margin: "20px" }}
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
    </div>
  );
};

const LoginContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};

export default Login;
