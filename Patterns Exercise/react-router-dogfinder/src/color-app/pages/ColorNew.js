import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ColorNew({ addColor }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("#000000");
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addColor({ name: name.trim(), value });
    // redirect to index after submit
    navigate("/colors", { replace: true });
  }

  return (
    <section style={{ padding: 16 }}>
      <h1>Add a Color</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} placeholder="magenta" />
        </label>
        <label>
          Value
          <input type="color" value={value} onChange={e => setValue(e.target.value)} />
        </label>
        <button>Add</button>
      </form>
      <p style={{ marginTop: 12 }}><Link to="/colors">Cancel</Link></p>
    </section>
  );
}