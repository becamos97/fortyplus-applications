import React from "react";
import { Link } from "react-router-dom";

function Candy() {
  return (
    <section className="Snack">
      <h2>Candy 🍬</h2>
      <p>Sweetness overload.</p>
      <Link to="/">← Back to Vending Machine</Link>
    </section>
  );
}

export default Candy;