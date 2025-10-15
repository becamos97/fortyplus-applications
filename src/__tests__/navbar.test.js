import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/NavBar";

it("shows nav links", () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
  expect(screen.getByText(/Vending Machine/i)).toBeInTheDocument();
  expect(screen.getByText(/Chips/i)).toBeInTheDocument();
  expect(screen.getByText(/Soda/i)).toBeInTheDocument();
  expect(screen.getByText(/Candy/i)).toBeInTheDocument();
});