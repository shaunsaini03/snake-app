import q_table from '../policies/1000_iter_q_learning_q_table.json'
import { useEffect } from 'react'

const LEFT_OF = { u: 'l', l: 'd', d: 'r', r: 'u' }
const RIGHT_OF = { u: 'r', r: 'd', d: 'l', l: 'u' }
const CARD_TO_VEC = { u: { x: -1, y: 0 }, d: { x: 1, y: 0 }, l: { x: 0, y: -1 }, r: { x: 0, y: 1 } }
const VEC_TO_CARD = (v) => (v.x === -1 ? 'u' : v.x === 1 ? 'd' : v.y === -1 ? 'l' : 'r')

const AIController = ({ state, onAction }) => {
  const BOARD_SIZE = state.boardSize

  function getActionFromQTable(q_table, state) {
    // don't act if game is over or state incomplete
    //if (state.done || !state?.snake?.length || !state.food || !state.dir) return

    function findFoodDir(state) {
      const { x: food_x, y: food_y } = state.food
      const { x: head_x, y: head_y } = state.snake[0]
      if (Math.abs(food_x - head_x) > Math.abs(food_y - head_y)) {
        return food_x < head_x ? 'u' : 'd'
      } else {
        return food_y < head_y ? 'l' : 'r'
      }
    } //looks correct

    function findDir(state) {
      if (state.dir.x === 0) {
        return state.dir.y === -1 ? 'l' : 'r'
      } else {
        return state.dir.x === -1 ? 'u' : 'd'
      }
    } //looks correct

    const { x: head_x, y: head_y } = state.snake[0]
    const dir = findDir(state)            // 'u' | 'd' | 'l' | 'r' (current absolute dir as cardinal)
    const food_dir = findFoodDir(state)   // 'u' | 'd' | 'l' | 'r'

    const danger_left = Number(
      (dir === 'u' && head_y <= 0) ||
      (dir === 'd' && head_y >= BOARD_SIZE - 1) ||
      (dir === 'r' && head_x <= 0) ||
      (dir === 'l' && head_x >= BOARD_SIZE - 1)
    ) //correct

    const danger_right = Number(
      (dir === 'u' && head_y >= BOARD_SIZE - 1) ||
      (dir === 'd' && head_y <= 0) ||
      (dir === 'r' && head_x >= BOARD_SIZE - 1) ||
      (dir === 'l' && head_x <= 0)
    ) //correct

    const danger_straight = Number(
      (dir === 'u' && head_x <= 0) ||
      (dir === 'd' && head_x >= BOARD_SIZE - 1) ||
      (dir === 'r' && head_y >= BOARD_SIZE - 1) ||
      (dir === 'l' && head_y <= 0)
    ) //correct

    const stateKey = `(('${dir}', '${food_dir}', ${danger_left}, ${danger_right}, ${danger_straight})` //correct
    console.log(stateKey)

    // Find best relative action from Q-table
    let bestRelAction = null // 'l' | 'r' | 's'
    let bestValue = -Infinity

    for (const [key, value] of Object.entries(q_table)) {
      if (key.startsWith(stateKey)) { // keys look like "((state_tuple), action)"
        const action = key.split(', ').pop().replace(')', '').replace("'", '').replace("'",'')
        if (value > bestValue) {
          bestValue = value
          bestRelAction = action
        }
      }
    } //correct

    // Fallback: if no entry for this state, keep going straight
    const rel = bestRelAction ?? 's'
    console.log(rel, "chosen action")

    // Map relative action to next absolute direction vector
    const currCard = VEC_TO_CARD(state.dir)
    console.log(currCard, "current direction")
    const nextCard = rel === 's' ? currCard : (rel === 'l' ? LEFT_OF[currCard] : RIGHT_OF[currCard])
    const nextDirVec = CARD_TO_VEC[nextCard]

    // Send absolute direction vector to the game
    onAction(nextDirVec)
  }

  useEffect(() => {
    getActionFromQTable(q_table, state)
  // include current dir & food so relative mapping stays correct and we recompute when needed
  }, [state.snake, state.dir, state.food, state.done])

  return null
}

export default AIController
