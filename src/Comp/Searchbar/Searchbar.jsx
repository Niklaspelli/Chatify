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
    <div style={searchBarStyle}>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleChange}
        style={inputStyle}
      />
    </div>
  );
};

const searchBarStyle = {
  marginBottom: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // Ensure onSearch is a function
};

export default SearchBar;
