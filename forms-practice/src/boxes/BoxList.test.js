import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BoxList from "./BoxList";
import "@testing-library/jest-dom";

function addBox(width = "70", height = "80", color = "teal") {
  fireEvent.change(screen.getByLabelText(/width/i), { target: { value: width } });
  fireEvent.change(screen.getByLabelText(/height/i), { target: { value: height } });
  fireEvent.change(screen.getByLabelText(/color/i), { target: { value: color } });
  fireEvent.click(screen.getByText(/add box/i));
}

it("renders without crashing", () => {
  render(<BoxList />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<BoxList />);
  expect(asFragment()).toMatchSnapshot();
});

it("can add and remove a box", () => {
  render(<BoxList />);
  expect(screen.getByLabelText(/boxes/i).querySelectorAll('[data-testid="box"]').length).toBe(0);

  addBox("70", "80", "teal");
  const box = screen.getByTestId("box");
  expect(box).toBeInTheDocument();
  expect(box).toHaveStyle({ width: "70px", height: "80px", backgroundColor: "teal" });

  fireEvent.click(screen.getByLabelText(/remove-box/i));
  expect(screen.queryByTestId("box")).toBeNull();
});