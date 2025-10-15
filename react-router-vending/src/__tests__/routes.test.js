import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RoutesList from "../RoutesList";

it("renders the VendingMachine on /", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <RoutesList />
    </MemoryRouter>
  );
  expect(screen.getByText(/React Router Vending Machine/i)).toBeInTheDocument();
});

it("navigates to Chips page", () => {
  render(
    <MemoryRouter initialEntries={["/chips"]}>
      <RoutesList />
    </MemoryRouter>
  );
  expect(screen.getByText(/Chips/i)).toBeInTheDocument();
  expect(screen.getByText(/Back to Vending Machine/i)).toBeInTheDocument();
});

it("shows 404 on unknown route", () => {
  render(
    <MemoryRouter initialEntries={["/missing"]}>
      <RoutesList />
    </MemoryRouter>
  );
  expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
});