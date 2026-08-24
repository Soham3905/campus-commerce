import React, { useState } from "react";

export const SearchBar = ({ data, style }) => {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: "5px", ...style }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "8px" }}>{data?.icon || "🔍"}</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={data?.placeholder || "Search..."}
          style={{
            fontSize: "14px",
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "inherit",
          }}
        />
      </div>
    </div>
  );
};
