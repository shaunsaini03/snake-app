import React, { useState, useEffect } from 'react';
import '../styles/SnakeGame.css'; // Create a CSS file for styling

const BOARD_SIZE = 10


const Board = () => {
  const [squares, setSquares] = useState(() => 
    Array.from({ length: 10 }, (_, row) =>
      row === 0
        ? [">", ...Array(9).fill(null)] // First row with snake head and rest null
        : Array(10).fill(null)          // All other rows filled with null
    )
  );
  console.log(squares)

  return (
    <div className="board">
      {squares.map((RowOfSquares) => (
        <Row tiles={RowOfSquares}/>
      ))}
    </div>
  );
};

const Row = ({tiles}) => {
  return (
    <>
    <div className='row'>
      {tiles.map((square, squareIdx) => (
        <div key={squareIdx} className='square'>
          {square}
        </div>
      ))}
    </div>
    </>
  );
}

export default Board;




