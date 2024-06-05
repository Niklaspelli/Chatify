import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import fakeAuth from "./FakeAuth";

const ProtectedRoute = () =>
  fakeAuth.isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ protectedRoute: true }} />
  );

export default ProtectedRoute;
