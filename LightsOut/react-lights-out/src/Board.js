import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({
  nrows = 5,
  ncols = 5,
  chanceLightStartsOn = 0.25
}) {
  // Build a fresh board (2D booleans)
  const makeBoard = useCallback(() => {
    return Array.from({ length: nrows }, () =>
      Array.from({ length: ncols }, () => Math.random() < chanceLightStartsOn)
    );
  }, [nrows, ncols, chanceLightStartsOn]);

  const [board, setBoard] = useState(makeBoard);

  // Has the player won?
  const hasWon = useMemo(
    () => board.every(row => row.every(cell => !cell)),
    [board]
  );

  // Flip this cell and its neighbors
  const flipCellsAround = useCallback((coord) => {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);
      const boardCopy = oldBoard.map(row => row.slice());

      function flipCell(y, x) {
        if (y >= 0 && y < nrows && x >= 0 && x < ncols) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      }

      flipCell(y, x);       // self
      flipCell(y - 1, x);   // up
      flipCell(y + 1, x);   // down
      flipCell(y, x - 1);   // left
      flipCell(y, x + 1);   // right

      return boardCopy;
    });
  }, [nrows, ncols]);

  const reset = () => setBoard(makeBoard);

  if (hasWon) {
    return (
      <div className="Board-win">
        <h1 className="neon">You Won!</h1>
        <button onClick={reset}>Play Again</button>
      </div>
    );
  }

  // Make table of <Cell /> components
  const table = [];
  for (let y = 0; y < nrows; y++) {
    const row = [];
    for (let x = 0; x < ncols; x++) {
      const coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          coord={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={flipCellsAround}
        />
      );
    }
    table.push(<tr key={y}>{row}</tr>);
  }

  return (
    <div className="Board">
      <h1 className="neon">Lights Out</h1>
      <table className="Board-table">
        <tbody>{table}</tbody>
      </table>
      <div className="Board-actions">
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}


export default Board;
