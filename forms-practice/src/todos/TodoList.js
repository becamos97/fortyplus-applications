import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import NewTodoForm from "./NewTodoForm";
import Todo from "./Todo";

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  function addTodo({ task }) {
    setTodos(ts => [...ts, { id: uuid(), task }]);
  }
  function removeTodo(id) {
    setTodos(ts => ts.filter(t => t.id !== id));
  }

  return (
    <>
      <NewTodoForm addTodo={addTodo} />
      <ul aria-label="todo-list">
        {todos.map(t => (
          <Todo key={t.id} {...t} removeTodo={() => removeTodo(t.id)} />
        ))}
      </ul>
    </>
  );
}