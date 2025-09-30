// src/gameCore.js

// Direction vectors
export const DIRS = {
    UP:    { x: -1, y: 0 },
    DOWN:  { x: 1, y: 0 },
    LEFT:  { x: 0, y: -1 },
    RIGHT: { x: 0, y: 1 },
  };
  
  // Pick a random cell that is not on the snake
  export function randFreeCell(snake, boardSize) {
    while (true) {
      const pos = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      };
      if (!snake.some(seg => seg.x === pos.x && seg.y === pos.y)) {
        return pos;
      }
    }
  }
  
  // Initial game state
  export function initialState(boardSize = 10) {
    const startSnake = [{ x: 0, y: 0 }];
    return {
      boardSize,
      snake: startSnake,
      dir: DIRS.RIGHT,
      food: randFreeCell(startSnake, boardSize),
      score: 0,
      done: false,
    };
  }
  
  /**
   * Perform one step of the game.
   * @param {object} state - current game state
   * @param {object} actionDir - direction vector {x,y} to move
   * @returns {object} { state: newState, reward: number, done: bool }
   */
  
  export function step(state, actionDir) {
    if (state.done) {
      return { state, reward: 0, done: true };
    }
  
    const { snake, boardSize, score } = state;
  
    // compute new head
    const head = {
      x: snake[0].x + actionDir.x,
      y: snake[0].y + actionDir.y,
    };
  
    // check collision
    const hitWall = head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize;
    const hitSelf = snake.some(seg => seg.x === head.x && seg.y === head.y);
  
    if (hitWall || hitSelf) {
      return {
        state: { ...state, done: true },
        reward: -1,
        done: true,
      };
    }
  
    // otherwise move snake
    const newSnake = [head, ...snake];
    let newFood = state.food;
    let newScore = score;
    let reward = 0;
  
    if (head.x === state.food.x && head.y === state.food.y) {
      // ate food
      newScore += 1;
      reward = +1;
      newFood = randFreeCell(newSnake, boardSize);
    } else {
      // drop tail
      newSnake.pop();
    }
  
    const newState = {
      ...state,
      snake: newSnake,
      dir: actionDir,
      food: newFood,
      score: newScore,
      done: false,
    };
  
    return { state: newState, reward, done: false };
  }
  