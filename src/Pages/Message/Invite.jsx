import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Invite({ id, token }) {
  const [inviteUrl, setInviteUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) =>
      (c === "x"
        ? Math.floor(Math.random() * 16)
        : Math.floor(Math.random() * 4) + 8
      ).toString(16)
    );
  };

  const sendInvite = async () => {
    console.log("Invite ID:", id);
    if (!id) {
      setError("No user ID provided");
      return;
    }

    const uuid = generateUUID();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/invite/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conversationId: uuid }),
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

      navigate("/chat");
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

export default Invite;
