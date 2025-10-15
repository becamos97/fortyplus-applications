import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";

export default function DogDetails({ dogs }) {
  const { name } = useParams();
  const dog = dogs.find(d => d.name.toLowerCase() === String(name).toLowerCase());
  if (!dog) return <Navigate to="/dogs" replace />;

  return (
    <section style={{ padding: 16 }}>
      <img src={dog.src} alt={dog.name} style={{ width: 300, borderRadius: 8 }} />
      <h1>{dog.name} <small style={{ fontWeight: 400 }}>({dog.age} years old)</small></h1>
      <ul>
        {dog.facts.map((f, idx) => <li key={idx}>{f}</li>)}
      </ul>
      <p><Link to="/dogs">← Back to all dogs</Link></p>
    </section>
  );
}