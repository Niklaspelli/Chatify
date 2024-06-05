import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./Pages/Login";
import Navbar from "./Comp/Navbar";

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
            {/* handle other routes */}
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
