import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="NavBar">
      <NavLink to="/" end>
        Vending Machine
      </NavLink>
      <NavLink to="/chips">Chips</NavLink>
      <NavLink to="/soda">Soda</NavLink>
      <NavLink to="/candy">Candy</NavLink>
    </nav>
  );
}

export default NavBar;