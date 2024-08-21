import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const USER_REGEX = /^[A-Öa-ö][A-z0-9-_åäöÅÄÖ]{3,23}$/;
const PWD_REGEX =
  /^(?=.*[a-zåäö])(?=.*[A-ÖÅÄÖ])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const csrf = import.meta.env.VITE_API_CSRF;
const register = import.meta.env.VITE_REGISTER;

function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [csrfToken, setCsrfToken] = useState("");
  const [userTaken, setUserTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user) && !userTaken;
    setValidName(result);
  }, [user, userTaken]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email) && !emailTaken;
    setValidEmail(result);
  }, [email, emailTaken]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    if (user) {
      checkUsername(user);
    }
  }, [user]);

  useEffect(() => {
    if (email) {
      checkEmail(email);
    }
  }, [email]);

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(csrf, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }

      const data = await response.json();
      setCsrfToken(data.csrfToken);
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  const checkUsername = async (username) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/?username=${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
        }
      );
      const data = await response.json();
      setUserTaken(data.exists);
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const checkEmail = async (email) => {
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
        }
      );
      const data = await response.json();
      setEmailTaken(data.exists);
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user) && !userTaken;
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await fetch(register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          username: user,
          password: pwd,
          email: email,
          avatar: "",
          csrfToken: csrfToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "User and email already in use");
      }

      const data = await response.json();
      console.log(data);
      setSuccess(true);
    } catch (error) {
      console.error("Registration error:", error);
      setErrMsg(`${error.message}`);
      errRef.current.focus();
    }
  };

  return (
    <div style={RegisterContainerStyle}>
      <div className="container">
        {success ? (
          <section>
            <h1>Lyckad registrering!</h1>
            <p>
              <a href="/login">Logga in</a>
            </p>
          </section>
        ) : (
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form onSubmit={handleSubmit}>
              <Row className="justify-content-center align-items-center h-100">
                <h2>Skapa Konto</h2>
                <Col md={6} lg={4} className="justify-content-center">
                  <label htmlFor="username">
                    Användarnamn:
                    <span className={validName ? "valid" : "hide"}>
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validName || !user ? "hide" : "invalid"}>
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  </label>
                  <Form.Floating
                    className="mb-1"
                    style={{
                      width: "400px",
                      display: "justify-content-center",
                    }}
                  >
                    <Form.Control
                      type="text"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      required
                      aria-invalid={validName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      style={{
                        backgroundColor: "185bac",
                        color: "white",
                        border: "none",
                      }}
                    />
                  </Form.Floating>
                  <p
                    id="uidnote"
                    className={
                      userFocus && user && !validName
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    {userTaken
                      ? "Username is already taken."
                      : "4 till 24 tecken. Måste börja med en bokstav. Bokstäver, nummer, understreck, bindesstreck är tillåtet."}
                  </p>
                  <label htmlFor="email">E-Mail:</label>
                  <span className={validEmail ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                  <span className={validEmail || !email ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={faTimes} />
                  </span>
                  <Form.Floating
                    className="mb-1"
                    style={{
                      width: "400px",
                      display: "justify-content-center",
                    }}
                  >
                    <Form.Control
                      type="text"
                      id="email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-invalid={validEmail ? "false" : "true"}
                      aria-describedby="emailnote"
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      style={{
                        backgroundColor: "185bac",
                        color: "white",
                        border: "none",
                      }}
                    />
                  </Form.Floating>
                  <p
                    id="emailnote"
                    className={
                      emailFocus && email && !validEmail
                        ? "instructions"
                        : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    {emailTaken
                      ? "Email is already in use."
                      : "Ange en giltig e-postadress."}
                  </p>

                  <label htmlFor="password">
                    Lösenord:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validPwd || !pwd ? "hide" : "invalid"}
                    />
                  </label>

                  <Form.Floating
                    className="mb-1"
                    style={{
                      width: "400px",
                      display: "justify-content-center",
                    }}
                  >
                    <Form.Control
                      type="password"
                      id="password"
                      onChange={(e) => setPwd(e.target.value)}
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      style={{
                        backgroundColor: "185bac",
                        color: "white",
                        border: "none",
                      }}
                    />
                  </Form.Floating>
                  <p
                    id="pwdnote"
                    className={
                      pwdFocus && !validPwd ? "instructions" : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 till 24 tecken.
                    <br />
                    Måste inkludera både stora och små bokstäver, en siffra och
                    ett specialtecken.
                    <br />
                    Tillåtna specialtecken är:
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>{" "}
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>{" "}
                    <span aria-label="percent">%</span>
                  </p>
                  <label htmlFor="confirm_pwd">
                    Upprepa Lösenord:
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={validMatch && matchPwd ? "valid" : "hide"}
                    />
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={validMatch || !matchPwd ? "hide" : "invalid"}
                    />
                  </label>
                  <Form.Floating
                    className="mb-1"
                    style={{
                      width: "400px",
                      display: "justify-content-center",
                    }}
                  >
                    <Form.Control
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      style={{
                        backgroundColor: "185bac",
                        color: "white",
                        border: "none",
                      }}
                    />
                  </Form.Floating>
                  <p
                    id="confirmnote"
                    className={
                      matchFocus && !validMatch ? "instructions" : "offscreen"
                    }
                  >
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Måste matcha det första lösenordet.
                  </p>
                  <Button
                    style={{ backgroundColor: "#185bac", margin: "20px" }}
                    type="submit"
                    disabled={
                      !validName || !validPwd || !validMatch || !validEmail
                        ? true
                        : false
                    }
                  >
                    Registrera
                  </Button>
                </Col>
              </Row>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

const RegisterContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};

export default Register;
