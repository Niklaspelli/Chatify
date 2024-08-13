import React, { useState } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    if (typeof onSearch === "function") {
      onSearch(newQuery); // Pass the query to the parent component
    } else {
      console.error("onSearch is not a function");
    }
  };

  return (
    <div style={searchBarContainerStyle}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
        style={inputStyle}
        aria-label="Search users"
      />
    </div>
  );
};

// Styles
const searchBarContainerStyle = {
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};

const inputStyle = {
  width: "100%",
  maxWidth: "400px",
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  outline: "none",
  fontSize: "16px",
  transition: "border-color 0.3s ease",
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // Validate that onSearch is a function
};

export default SearchBar;
