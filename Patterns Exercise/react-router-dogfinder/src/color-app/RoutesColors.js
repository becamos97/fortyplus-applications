import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ColorsIndex from "./pages/ColorsIndex";
import ColorNew from "./pages/ColorNew";
import ColorShow from "./pages/ColorShow";

const STORAGE_KEY = "colors-v1";

export default function RoutesColors() {
  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{ name: "red", value: "#ff0000" }, { name: "green", value: "#00ff00" }, { name: "blue", value: "#0000ff" }];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);

  function addColor({ name, value }) {
    // new color appears at the top
    setColors(prev => [{ name: name.toLowerCase(), value }, ...prev.filter(c => c.name !== name.toLowerCase())]);
  }

  return (
    <Routes>
      <Route path="/colors" element={<ColorsIndex colors={colors} />} />
      <Route path="/colors/new" element={<ColorNew addColor={addColor} />} />
      <Route path="/colors/:color" element={<ColorShow colors={colors} />} />
      {/* redirect unknowns to /colors */}
      <Route path="*" element={<Navigate to="/colors" replace />} />
    </Routes>
  );
}