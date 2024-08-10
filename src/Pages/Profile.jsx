import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Profile() {
  const location = useLocation();
  const { token, userId } = location.state || {};
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Token from state:", token); // Debugging
    console.log("User ID from state:", userId); // Debugging
  }, [token, userId]);

  const handleDelete = async () => {
    if (!userId || !token) {
      setError("User ID or token is missing");
      return;
    }

    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      console.log(`User with ID ${userId} deleted successfully`);
    } catch (error) {
      setError(error.message);
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}

export default Profile;
