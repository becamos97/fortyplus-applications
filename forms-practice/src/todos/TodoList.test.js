import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodoList from "./TodoList";

it("renders without crashing", () => {
  render(<TodoList />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<TodoList />);
  expect(asFragment()).toMatchSnapshot();
});

it("can add and remove a todo", () => {
  render(<TodoList />);

  expect(screen.getByLabelText(/todo-list/i).children.length).toBe(0);

  fireEvent.change(screen.getByLabelText(/task/i), { target: { value: "Study React" } });
  fireEvent.click(screen.getByText(/add todo/i));

  expect(screen.getByText("Study React")).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/remove-todo/i));
  expect(screen.queryByText("Study React")).toBeNull();
});