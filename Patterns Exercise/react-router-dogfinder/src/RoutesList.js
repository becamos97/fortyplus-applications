import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import DogList from "./components/DogList";
import DogDetails from "./components/DogDetails";

export default function RoutesList({ dogs }) {
  return (
    <>
      <Nav dogs={dogs.map(d => d.name)} />
      <Routes>
        <Route path="/dogs" element={<DogList dogs={dogs} />} />
        <Route path="/dogs/:name" element={<DogDetails dogs={dogs} />} />
        {/* redirect everything else to /dogs */}
        <Route path="*" element={<Navigate to="/dogs" replace />} />
      </Routes>
    </>
  );
}