// GameView.js
import React from "react";
import "../styles/GameView.css";

const GameView = ({ state }) => {
  const { boardSize, snake, food } = state;

  return (
    <div className="board">
      {Array.from({ length: boardSize }).map((_, row) => (
        <div key={row} className="row">
          {Array.from({ length: boardSize }).map((_, col) => {
            const isSnake = snake.some(seg => seg.x === row && seg.y === col);
            const isFood = food.x === row && food.y === col;
            return (
              <div
                key={col}
                className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameView;
