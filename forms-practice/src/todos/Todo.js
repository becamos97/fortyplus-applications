import React from "react";

export default function Todo({ task, removeTodo }) {
  return (
    <li>
      <span>{task}</span>{" "}
      <button aria-label="remove-todo" onClick={removeTodo}>X</button>
    </li>
  );
}