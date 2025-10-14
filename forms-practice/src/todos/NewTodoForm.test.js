import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import NewTodoForm from "./NewTodoForm";

it("renders without crashing", () => {
  render(<NewTodoForm addTodo={() => {}} />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<NewTodoForm addTodo={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});