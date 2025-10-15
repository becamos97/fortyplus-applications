import React from "react";
import { Link } from "react-router-dom";

function VendingMachine() {
  return (
    <main className="Vending">
      <h1>React Router Vending Machine</h1>
      <p>Pick a snack:</p>
      <ul>
        <li><Link to="/chips">Chips</Link></li>
        <li><Link to="/soda">Soda</Link></li>
        <li><Link to="/candy">Candy</Link></li>
      </ul>
    </main>
  );
}

export default VendingMachine;