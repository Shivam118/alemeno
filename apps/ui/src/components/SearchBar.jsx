import { Box } from "@mui/material";
import React from "react";

const SearchBar = () => {
  return (
    <Box style={{ width: "100%" }}>
      <form>
        <input
          type="text"
          placeholder="Search Courses"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />
      </form>
    </Box>
  );
};

export default SearchBar;
