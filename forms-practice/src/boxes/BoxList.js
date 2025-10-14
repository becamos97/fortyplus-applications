import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import NewBoxForm from "./NewBoxForm";
import Box from "./Box";

export default function BoxList() {
  const [boxes, setBoxes] = useState([]);

  function addBox({ width, height, backgroundColor }) {
    const newBox = { id: uuid(), width: +width, height: +height, backgroundColor };
    setBoxes(b => [...b, newBox]);
  }

  function removeBox(id) {
    setBoxes(b => b.filter(box => box.id !== id));
  }

  return (
    <>
      <NewBoxForm addBox={addBox} />
      <div aria-label="boxes">
        {boxes.map(b => (
          <Box key={b.id} {...b} removeBox={() => removeBox(b.id)} />
        ))}
      </div>
    </>
  );
}