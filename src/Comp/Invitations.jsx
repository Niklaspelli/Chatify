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
    <div style={InvitationsContainerStyle}>
      <h2 style={{ margin: "10px" }}>Dina inbjudningar!</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <div className="dropdown">
          <button className="dropbtn">Klicka här</button>
          <div className="dropdown-content">
            {invitations.length > 0 ? (
              <div className="scrollable-list">
                <ul>
                  {invitations.map((invite, index) => (
                    <li key={index}>{invite.invite}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>Du har inga inbjudningar just nu.</p>
            )}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default Invitations;

const InvitationsContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};
