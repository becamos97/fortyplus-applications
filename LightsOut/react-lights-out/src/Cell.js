import React from "react";
import "./Cell.css";

/** A single cell on the board.
 *
 * Props:
 * - isLit: boolean — whether this cell is lit
 * - flipCellsAroundMe: function — called when cell is clicked
 * - coord: "y-x" string coordinate for testing/lookup
 */

function Cell({ isLit, flipCellsAroundMe, coord }) {
  const classes = "Cell" + (isLit ? " Cell-lit" : "");

  const handleClick = () => {
    flipCellsAroundMe(coord);
  };

  return (
    <td className={classes} onClick={handleClick} data-coord={coord} />
  );
}

export default Cell;