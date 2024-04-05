import React from "react";

export default function TableTitle({ title }) {
  return (
    <h4
      style={{
        textAlign: "center",
        marginTop: 2,
        marginBottom: 0,
        borderBottomWidth: "2px",
        borderBottomStyle: "solid",
        borderBottomColor: "rgba(81, 81, 81, 1)",
      }}
    >
      {title}
    </h4>
  );
}
