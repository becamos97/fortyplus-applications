import React from "react";
import BoxList from "./boxes/BoxList";
import TodoList from "./todos/TodoList";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Forms Practice</h1>

      <section>
        <h2>Color Box Maker</h2>
        <BoxList />
      </section>

      <hr style={{ margin: "24px 0" }} />

      <section>
        <h2>Todos</h2>
        <TodoList />
      </section>
    </div>
  );
}