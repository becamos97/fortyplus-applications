import React from "react";
import { Link } from "react-router-dom";

function Chips() {
  return (
    <section className="Snack">
      <h2>Chips 🥔</h2>
      <p>Crunchy. Salty. Irresistible.</p>
      <Link to="/">← Back to Vending Machine</Link>
    </section>
  );
}

export default Chips;