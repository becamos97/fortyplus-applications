import React from "react";
import { Link } from "react-router-dom";

export default function ColorsIndex({ colors }) {
  return (
    <section style={{ padding: 16 }}>
      <h1>Color Factory</h1>
      <p><Link to="/colors/new">Add a color</Link></p>
      <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, listStyle: "none", padding: 0 }}>
        {colors.map(c => (
          <li key={c.name} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
            <Link to={`/colors/${encodeURIComponent(c.name)}`} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <div style={{ height: 80, background: c.value }} />
              <div style={{ padding: 8, fontWeight: 600 }}>{c.name} <small style={{ fontWeight: 400 }}>{c.value}</small></div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}