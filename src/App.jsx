import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Login from "./Pages/Login";
import Navbar from "./Navbar";

import Register from "./Pages/Register";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/blog" element={<Blog />} />
            <Route path="/userprofile" element={<UserProfile />} />
            {/* handle other routes */}
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
