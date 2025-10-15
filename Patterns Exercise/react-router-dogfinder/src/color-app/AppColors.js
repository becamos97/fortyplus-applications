import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesColors from "./RoutesColors";

export default function AppColors() {
  return (
    <BrowserRouter>
      <RoutesColors />
    </BrowserRouter>
  );
}