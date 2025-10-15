import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";

export default function ColorShow({ colors }) {
  const { color } = useParams();
  const found = colors.find(c => c.name.toLowerCase() === String(color).toLowerCase());

  if (!found) return <Navigate to="/colors" replace />; // Story 5

  return (
    <section style={{
      minHeight: "100vh",
      background: found.value,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      padding: 16
    }}>
      <div>
        <h1>{found.name}</h1>
        <p>{found.value}</p>
        <Link to="/colors" style={{ color: "#fff", textDecoration: "underline" }}>Back to colors</Link>
      </div>
    </section>
  );
}