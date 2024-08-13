import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve token and id from location state or localStorage
  const stateToken = location.state?.token || "";
  const stateId = location.state?.id || "";

  // State initialization
  const [token, setToken] = useState(
    stateToken || localStorage.getItem("token") || ""
  );
  const [id, setId] = useState(stateId || localStorage.getItem("Id") || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Simulate a loading state for a better user experience
    const checkCredentials = async () => {
      if (!token || !id) {
        setError("Token or ID is missing");
      }
      setIsLoading(false);
    };

    checkCredentials();
  }, [token, id]);

  const handleDelete = async () => {
    if (!token || !id) {
      setError("ID or token is missing");
      console.error("Error:", { token, id });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://chatify-api.up.railway.app/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to delete user: ${response.statusText}`
        );
      }

      navigate("/login", {
        state: { message: "Account deleted successfully." },
      });
    } catch (error) {
      setError(`Delete request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleConfirmAction = () => {
    handleDelete();
    setShowConfirmation(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Profile</h2>
      {error && (
        <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
          <span className="text-xs text-center">{error}</span>
        </div>
      )}
      {!showConfirmation ? (
        <button
          onClick={handleConfirmDelete}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete Account"}
        </button>
      ) : (
        <div className="confirmation-prompt">
          <p>Är du säker att vill radera kontot?</p>
          <button onClick={handleConfirmAction} className="btn btn-primary">
            Yes
          </button>
          <button onClick={handleCancelDelete} className="btn btn-secondary">
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
