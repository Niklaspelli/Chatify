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
    // Update authentication status
    setIsAuthenticated(fakeAuth.isAuthenticated);
  }, [fakeAuth.isAuthenticated]); // Dependency on auth status

  const logout = () => {
    fakeAuth.signOut(() => {
      navigate("/login");
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
                <span onClick={logout} style={{ cursor: "pointer" }}>
                  Logout
                </span>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
