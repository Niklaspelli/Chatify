import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Invite({ id, token }) {
  const [inviteUrl, setInviteUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Function to generate a UUID
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
      (c === "x"
        ? Math.floor(Math.random() * 16)
        : Math.floor(Math.random() * 4) + 8
      ).toString(16)
    );
  };

  // Function to send the invite
  const sendInvite = async () => {
    console.log("Invite ID:", id); // Log the ID
    if (!id) {
      setError("No user ID provided");
      return;
    }

    const uuid = generateUUID(); // Generate the UUID
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/invite/${id}`, // API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token
          },
          body: JSON.stringify({ conversationId: uuid }), // Send the UUID as conversationId
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to send invite: ${response.statusText}`
        );
      }

      const data = await response.json();
      setInviteUrl(
        data.inviteUrl || `https://chatify-api.up.railway.app/invite/${id}`
      );

      // Redirect to NewMessage component or desired route
      navigate("/chat"); // Ensure the path matches your route configuration
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendInvite} disabled={loading}>
        {loading ? "Sending..." : "Invite"}
      </button>
      {inviteUrl && (
        <div>
          Invite sent! URL:{" "}
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
            {inviteUrl}
          </a>
        </div>
      )}
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
}

Invite.propTypes = {
  id: PropTypes.number.isRequired, // Ensure prop name matches and is a number
  token: PropTypes.string.isRequired,
};

export default Invite;
