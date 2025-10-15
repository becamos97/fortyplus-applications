import React from "react";
import { Link } from "react-router-dom";

function Soda() {
  return (
    <section className="Snack">
      <h2>Soda 🥤</h2>
      <p>Fizz, pop, refresh.</p>
      <Link to="/">← Back to Vending Machine</Link>
    </section>
  );
}

export default Soda;