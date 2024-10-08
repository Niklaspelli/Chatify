import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import fakeAuth from "./fakeAuth";

const ProtectedRoute = () => {
  const isAuthenticated = fakeAuth.checkAuth();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ protectedRoute: true }} />
  );
};

export default ProtectedRoute;
