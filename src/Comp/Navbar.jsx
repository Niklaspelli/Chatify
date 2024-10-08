import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import "../index.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    fakeAuth.isAuthenticated
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidenav = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(fakeAuth.isAuthenticated);
  }, [fakeAuth.isAuthenticated]);

  const logout = () => {
    fakeAuth.signOut(() => {
      navigate("/");
    });
  };

  return (
    <div className={`sidenav ${isOpen ? "open" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidenav}>
        ☰
      </button>
      <nav className="nav">
        <ul>
          {!isAuthenticated ? (
            <li>
              <Link to={"/login"}>Sign In/ Sign Up</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to={"/profile"}>Profile</Link>
              </li>
              <li>
                <Link to={"/chat"}>Chat</Link>
              </li>
              <li>
                <div
                  onClick={logout}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    position: "relative",
                    left: "30px",
                  }}
                >
                  Logout
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
