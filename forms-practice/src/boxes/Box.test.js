import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Box from "./Box";
import "@testing-library/jest-dom";

it("renders without crashing", () => {
  render(<Box width={50} height={60} backgroundColor="red" removeBox={() => {}} />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<Box width={50} height={60} backgroundColor="red" removeBox={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});

it("calls remove on click", () => {
  const mock = jest.fn();
  render(<Box width={50} height={60} backgroundColor="red" removeBox={mock} />);
  fireEvent.click(screen.getByLabelText(/remove-box/i));
  expect(mock).toHaveBeenCalled();
});