import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../index.css";
const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(
    localStorage.getItem("profilePicture") || "https://i.pravatar.cc/200"
  );
  const [tempPicture, setTempPicture] = useState(selectedPicture);

  useEffect(() => {
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

      localStorage.removeItem("token");
      localStorage.removeItem("Id");
      localStorage.removeItem("profilePicture");

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

  const openPictureModal = () => {
    setShowPictureModal(true);
  };

  const handlePictureSelect = () => {
    const newPictureUrl = `https://i.pravatar.cc/200?img=${
      Math.floor(Math.random() * 70) + 1
    }`;
    setTempPicture(newPictureUrl);
  };

  const handleSavePicture = async () => {
    setSelectedPicture(tempPicture);
    localStorage.setItem("profilePicture", tempPicture);

    if (!token || !id) {
      setError("ID or token is missing");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://chatify-api.up.railway.app/user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          updatedData: { avatar: tempPicture },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update profile picture: ${response.statusText} for user ${id}`
        );
      }

      const data = await response.json();
      console.log("Response Data:", data);

      if (Array.isArray(data) && data.length > 0) {
        const updatedUser = data[0];
        console.log("Updated User:", updatedUser);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      setError(`Update request failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setShowPictureModal(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div style={ProfileContainerStyle}>
        {error && (
          <div role="alert" className="ml-1 mt-4 w-52 alert alert-error">
            <span className="text-xs text-center">{error}</span>
          </div>
        )}

        <div className="selected-picture">
          <h4>Din valda bild:</h4>
          <img
            src={selectedPicture}
            alt="Selected Avatar"
            style={{ width: "200px", height: "200px", borderRadius: "50%" }}
          />
        </div>

        <Button
          style={{ backgroundColor: "black", margin: "20px" }}
          onClick={openPictureModal}
        >
          Välj profilbild
        </Button>
        <div className="center">
          <Modal
            show={showPictureModal}
            onHide={() => setShowPictureModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Välj en profilbild</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="picture-options">
                <img
                  src={tempPicture}
                  alt="Avatar"
                  className="picture"
                  onClick={handlePictureSelect}
                  style={{
                    cursor: "pointer",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleSavePicture}>
                Spara
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        {!showConfirmation ? (
          <Button
            style={{ backgroundColor: "red", margin: "20px" }}
            onClick={handleConfirmDelete}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        ) : (
          <div className="confirmation-prompt">
            <p>Är du säker att vill radera kontot?</p>
            <button onClick={handleConfirmAction} className="btn btn-primary">
              Ja
            </button>
            <button onClick={handleCancelDelete} className="btn btn-secondary">
              Nej
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

const ProfileContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
  marginTop: "200px",
};
