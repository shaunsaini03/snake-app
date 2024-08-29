# Spec:
- We want to create a snake game on a board. The snake will start on the top left corner of the board with a length of 1 (only the head) and a piece of food will be generated randomly away from the snake head.
- Every tick will cause the snake to move 1 unit in the direction it is headed in. Every key press (up, down, left, right) will cause the snake to move in that direction on the next tick.
- If the snake crashes into itself, or goes out of bounds, then game over

# Game

## Board
### Hooks
- 