import React, { useState, useEffect } from "react";
import "../../index.css";

function Invitations({ token, id }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    fetchInvitations();
  }, [token]);

  const fetchInvitations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch invitations");
      }
      const data = await response.json();
      setInvitations(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch invitations:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopySuccess("Copied!"))
      .catch(() => setCopySuccess("Failed to copy!"));

    // Clear the message after 2 seconds
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div>
      <h2>Dina inbjudningar!</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <>
          {invitations.length > 0 ? (
            <ul>
              {invitations.map((invite, index) => (
                <li key={index}>{invite.invite}</li>
              ))}
            </ul>
          ) : (
            <p>Du har inga inbjudningar just nu.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Invitations;
