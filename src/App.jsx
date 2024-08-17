import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./Pages/Login";
import Navbar from "./Comp/Navbar";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import Chat from "./Pages/Chat";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
