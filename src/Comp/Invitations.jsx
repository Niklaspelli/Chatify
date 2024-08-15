import React, { useState, useEffect } from "react";
import "../index.css";

function Invitations({ token, id, users }) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          {/* Additional logic to use the `users` prop if needed */}
          {users && users.length > 0 && (
            <div>
              <h3>Tillgängliga användare:</h3>
              <ul>
                {users.map((user) => (
                  <li key={user.id}>{user.username}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Invitations;
