import React from "react";
import { render } from "@testing-library/react";
import NewBoxForm from "./NewBoxForm";
import "@testing-library/jest-dom";

it("renders without crashing", () => {
  render(<NewBoxForm addBox={() => {}} />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<NewBoxForm addBox={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});