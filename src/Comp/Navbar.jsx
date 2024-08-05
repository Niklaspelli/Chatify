import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";
import "../index.css";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidenav = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(fakeAuth.isAuthenticated);
  });

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
          <li>
            <Link to={"/Profile"}>Profile</Link>
          </li>
          <li>
            <Link to={"/Chat"}>Chat</Link>
          </li>
          <li>
            {!fakeAuth.isAuthenticated ? (
              <Link to={"/login"}>Sign In/ Sign Up</Link>
            ) : (
              <span onClick={logout}>Logout</span>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
