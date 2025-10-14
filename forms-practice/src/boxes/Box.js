import React from "react";

export default function Box({ width, height, backgroundColor, removeBox }) {
  const style = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor,
    display: "inline-block",
    margin: 8,
    borderRadius: 6,
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      <div data-testid="box" style={style} />
      <button aria-label="remove-box" onClick={removeBox}>X</button>
    </div>
  );
}