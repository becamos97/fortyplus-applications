import React, { useState } from "react";

export default function NewTodoForm({ addTodo }) {
  const [task, setTask] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const cleaned = task.trim();
    if (!cleaned) return;
    addTodo({ task: cleaned });
    setTask("");
  }

  return (
    <form onSubmit={handleSubmit} aria-label="new-todo-form">
      <label htmlFor="task">Task:</label>
      <input id="task" name="task" value={task} onChange={e => setTask(e.target.value)} />
      <button>Add Todo</button>
    </form>
  );
}