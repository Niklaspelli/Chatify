/* import React from "react";
import PropTypes from "prop-types";
import MessageList from "./MessageList";

const ChatPopup = ({
  posts,
  newPostContent,
  setNewPostContent,
  handleCreatePost,
  handleDelete,
  loading,
  error,
  closeChat,
  currentUserId,
}) => {
  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <button onClick={closeChat} style={{ float: "right" }}>
          Close
        </button>
        <MessageList
          posts={posts}
          onDelete={handleDelete}
          currentUserId={currentUserId}
        />
        <textarea
          placeholder="Message:"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          style={{ width: "100%", height: "60px" }}
        />
        <button onClick={handleCreatePost} disabled={!newPostContent}>
          Send
        </button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

ChatPopup.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Ensure id is a string if that's the requirement
      content: PropTypes.string.isRequired, // Add other required properties of posts
    })
  ).isRequired,
  newPostContent: PropTypes.string.isRequired,
  setNewPostContent: PropTypes.func.isRequired,
  handleCreatePost: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  closeChat: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, // Ensure the overlay is on top
};

const popupStyle = {
  width: "80%", // Adjust width as needed
  height: "80%", // Adjust height as needed
  maxWidth: "800px", // Optional: maximum width
  maxHeight: "600px", // Optional: maximum height
  border: "1px solid #ccc",
  backgroundColor: "gray",
  padding: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  overflowY: "auto", // Allow scrolling if content overflows
};

export default ChatPopup;
 */
