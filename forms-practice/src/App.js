import React, { useState } from "react";


import BoxList from "./boxes/BoxList";
import TodoList from "./todos/TodoList";
import Deck from "./cards/Deck";

const VIEWS = {
  cards: { label: "Cards (Deck of Cards)", Component: Deck },
  boxes: { label: "Color Box Maker", Component: BoxList },
  todos: { label: "Todos", Component: TodoList },
};

export default function App() {
  const [view, setView] = useState("cards");
  const { Component } = VIEWS[view];

  return (
    <div style={{ padding: 20 }}>
      <h1>Assignments</h1>

      <label style={{ marginRight: 8 }} htmlFor="view">Show:</label>
      <select id="view" value={view} onChange={e => setView(e.target.value)}>
        {Object.entries(VIEWS).map(([key, v]) => (
          <option key={key} value={key}>{v.label}</option>
        ))}
      </select>

      <hr style={{ margin: "16px 0" }} />
      <Component />
    </div>
  );
}

// export default function App() {
//   return (
//     <div style={{ padding: 16 }}>
//       <h1>Forms Practice</h1>

//       <section>
//         <h2>Color Box Maker</h2>
//         <BoxList />
//       </section>

//       <hr style={{ margin: "24px 0" }} />

//       <section>
//         <h2>Todos</h2>
//         <TodoList />
//       </section>
//     </div>
//   );
// }
