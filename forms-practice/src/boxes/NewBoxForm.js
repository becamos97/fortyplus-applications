import React, { useState } from "react";

const INITIAL = { width: "100", height: "100", backgroundColor: "#ff0000" };

export default function NewBoxForm({ addBox }) {
  const [formData, setFormData] = useState(INITIAL);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addBox(formData);
    setFormData(INITIAL);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="new-box-form">
      <label htmlFor="width">Width (px):</label>
      <input id="width" name="width" value={formData.width} onChange={handleChange} />

      <label htmlFor="height" style={{ marginLeft: 8 }}>Height (px):</label>
      <input id="height" name="height" value={formData.height} onChange={handleChange} />

      <label htmlFor="backgroundColor" style={{ marginLeft: 8 }}>Color:</label>
      <input id="backgroundColor" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} />

      <button style={{ marginLeft: 8 }}>Add Box</button>
    </form>
  );
}