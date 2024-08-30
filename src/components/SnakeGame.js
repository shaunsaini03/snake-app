import React, { useState, useEffect } from 'react';
import '../styles/SnakeGame.css'; // Create a CSS file for styling

const BOARD_SIZE = 10


const Board = () => {
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]); // Initial snake position
  const [food, setFood] = useState(() => generateFoodPosition());
  const [direction, setDirection] = useState({x: 1, y: 0}); // Initial direction
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(1000)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    console.log(direction)
    if (gameOver) return;

    const intervalId = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(intervalId);
  }, [snake, direction, gameOver]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log(event.key)
      switch (event.key) {
        case 'ArrowUp':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowDown':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case 'ArrowLeft':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowRight':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFoodPosition());
      setScore(score + 1)
      setSpeed(speed * 0.95)
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const checkCollision = (head) => {
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }
    for (const segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        return true;
      }
    }
    return false;
  };

  function generateFoodPosition() {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    return { x, y };
  };

  const resetGame = () => {
    if (score > highScore) setHighScore(score);
    setSnake([{ x: 0, y: 0 }]);
    setFood(generateFoodPosition());
    setDirection({ x: 1, y: 0 });
    setScore(0)
    setGameOver(false);
  };


  return (
    <div>
      <h1>Snake</h1>
      <Score score={score} highScore={highScore}/>
      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <button onClick={resetGame}>Restart</button>
        </div>
      ) : (
        <div className="board">
          {Array.from({ length: BOARD_SIZE }).map((_, row) =>
            <div key={row} className="row">
              {Array.from({ length: BOARD_SIZE }).map((_, col) => {
                const isSnake = snake.some(segment => segment.x === row && segment.y === col);
                const isFood = food.x === row && food.y === col;
                return (
                  <div key={col} className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}></div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Score = ({score, highScore}) => {
  return (
    <>
    <div className='scoreBoard'>
      Score: {score} High Score: {highScore}
    </div>
    </>
  )
}




export default Board;




