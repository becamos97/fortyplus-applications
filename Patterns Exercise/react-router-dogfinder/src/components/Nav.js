import React from "react";
import { NavLink } from "react-router-dom";

export default function Nav({ dogs }) {
  const linkClass = ({ isActive }) => (isActive ? "active" : undefined);
  return (
    <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee"}}>
      <NavLink to="/dogs" end className={linkClass}>All Dogs</NavLink>
      {dogs.map(name => (
        <NavLink key={name} to={`/dogs/${name.toLowerCase()}`} className={linkClass}>
          {name}
        </NavLink>
      ))}
    </nav>
  );
}