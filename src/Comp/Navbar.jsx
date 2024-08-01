import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fakeAuth from "../Auth/fakeAuth";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    <nav>
      <ul>
        <li>
          {!fakeAuth.isAuthenticated ? (
            <Link to={"/login"}>Sign In/ Sign Up</Link>
          ) : (
            <span onClick={logout}>Logout</span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
