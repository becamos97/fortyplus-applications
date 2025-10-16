import React from "react";

/**
 * Shows one joke, current net votes, and up/down buttons.
 * Props:
 *  - id, text, votes, onUp(), onDown()
 */
export default function Joke({ text, votes, onUp, onDown }) {
  return (
    <article style={styles.row}>
      <div style={styles.text}>{text}</div>
      <div style={styles.controls}>
        <button onClick={onDown} aria-label="Vote down" style={styles.btn}>−</button>
        <span style={styles.votes} aria-live="polite">{votes}</span>
        <button onClick={onUp} aria-label="Vote up" style={styles.btn}>+</button>
      </div>
    </article>
  );
}

const styles = {
  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 12,
    alignItems: "center"
  },
  text: { lineHeight: 1.4 },
  controls: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderLeft: "1px solid #eee",
    paddingLeft: 12
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fafafa",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "30px"
  },
  votes: { minWidth: 28, textAlign: "center", fontVariantNumeric: "tabular-nums" }
};