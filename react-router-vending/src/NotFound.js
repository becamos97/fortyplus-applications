import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="NotFound">
      <h2>404 — Not Found</h2>
      <p>That snack fell behind the coils 😅</p>
      <Link to="/">Go Home</Link>
    </section>
  );
}

export default NotFound;