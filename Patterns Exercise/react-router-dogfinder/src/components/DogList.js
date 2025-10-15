import React from "react";
import { Link } from "react-router-dom";

export default function DogList({ dogs }) {
  return (
    <section style={{ padding: 16 }}>
      <h1>Dog Finder</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {dogs.map(d => (
          <Link
            key={d.name}
            to={`/dogs/${d.name.toLowerCase()}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <figure style={{ margin: 0, border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
              <img src={d.src} alt={d.name} style={{ width: "100%", display: "block" }} />
              <figcaption style={{ padding: 8, fontWeight: 600 }}>{d.name} · {d.age}</figcaption>
            </figure>
          </Link>
        ))}
      </div>
    </section>
  );
}