import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Todo from "./Todo";

it("renders without crashing", () => {
  render(<Todo task="Test" removeTodo={() => {}} />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<Todo task="Test" removeTodo={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});

it("calls remove on click", () => {
  const mock = jest.fn();
  render(<Todo task="Delete me" removeTodo={mock} />);
  fireEvent.click(screen.getByLabelText(/remove-todo/i));
  expect(mock).toHaveBeenCalled();
});