# imports
from itertools import product
import random
import math
import os
import json

# setup
NUM_ITERATIONS = 1000
BOARD_SIZE = 10
DIRS = {
    'UP':    { 'x': -1, 'y': 0 },
    'DOWN':  { 'x': 1, 'y': 0 },
    'LEFT':  { 'x': 0, 'y': -1 },
    'RIGHT': { 'x': 0, 'y': 1 },
}
LEFT_MAP = {'UP': 'LEFT', 'DOWN': 'RIGHT', 'LEFT': 'DOWN', 'RIGHT': 'UP'}
RIGHT_MAP = {'UP': 'RIGHT', 'DOWN': 'LEFT', 'LEFT': 'UP', 'RIGHT': 'DOWN'}

FILE_DIRECTORY = os.path.abspath('src/policies')




dirs = ('l', 'r', 'u', 'd')
food_dir = ('l', 'r', 'u', 'd')
danger_left = (0, 1)
danger_right = (0, 1)
danger_straight = (0, 1)
actions = ('l', 'r', 's')

def create_q_table(dirs=dirs, food_dir=food_dir, danger_left=danger_left, danger_right=danger_right, danger_straight=danger_straight):
    q_table = {}
    for state in product(dirs, food_dir, danger_left, danger_right, danger_straight):
        for action in actions:
            q_table[(state, action)] = 0.0
    return q_table



def choose_action(state, q_table, epsilon=0.1):
    # exploration
    if random.random() < epsilon:
        return random.choice(actions)
    # exploitation
    q_values = [q_table[(state, a)] for a in actions]
    max_val = max(q_values)
    best_actions = [a for a in actions if q_table[(state, a)] == max_val]
    return random.choice(best_actions)  # break ties randomly


def update_q(q_table, state, action, reward, next_state, alpha=0.1, gamma=0.9):
    max_next_q = max(q_table[(next_state, a)] for a in actions)
    td_target = reward + gamma * max_next_q
    td_error = td_target - q_table[(state, action)]
    q_table[(state, action)] += alpha * td_error


# simplified Snake game for Q-learning

class SimplifiedGameState:
    def __init__(self, board_size=BOARD_SIZE):
        self.board_size = board_size
        self.reset()

    def reset(self):
        self.snake = [{'x': 0, 'y': 0}]
        self.dir = 'RIGHT'
        self.food = self.rand_free_cell()
        self.score = 0
        self.done = False
        return self.get_features()

    def rand_free_cell(self):
        while True:
            pos = {
                'x': random.randint(0, self.board_size - 1),
                'y': random.randint(0, self.board_size - 1)
            }
            if all(seg['x'] != pos['x'] or seg['y'] != pos['y'] for seg in self.snake):
                return pos

    def step(self, action):
        # turn based on action

        if action == 'l':
            self.dir = LEFT_MAP[self.dir]
        elif action == 'r':
            self.dir = RIGHT_MAP[self.dir]
        # 's' means go straight → no change

        # move head
        dx, dy = DIRS[self.dir]['x'], DIRS[self.dir]['y']
        head = self.snake[0]
        new_head = {'x': head['x'] + dx, 'y': head['y'] + dy}

        # check collisions
        if (
            new_head['x'] < 0 or new_head['x'] >= self.board_size or
            new_head['y'] < 0 or new_head['y'] >= self.board_size or
            any(seg['x'] == new_head['x'] and seg['y'] == new_head['y'] for seg in self.snake)
        ):
            self.done = True
            return self.get_features(), -10, True

        # advance snake
        self.snake.insert(0, new_head)
        reward = -1
        if new_head['x'] == self.food['x'] and new_head['y'] == self.food['y']:
            reward = 10
            self.food = self.rand_free_cell()
            self.score += 1
        else:
            self.snake.pop()

        return self.get_features(), reward, self.done

    
    def get_features(self):
        head = self.snake[0]
        dir_ = self.dir

        # danger straight/left/right
        def danger(direction):
            dx, dy = DIRS[direction]['x'], DIRS[direction]['y']
            nx, ny = head['x'] + dx, head['y'] + dy
            return int(
                nx < 0 or nx >= self.board_size or
                ny < 0 or ny >= self.board_size or
                any(seg['x'] == nx and seg['y'] == ny for seg in self.snake)
            )

        danger_straight = danger(dir_)
        danger_left = danger(LEFT_MAP[dir_])
        danger_right = danger(RIGHT_MAP[dir_])

        # food direction (relative)
        fx, fy = self.food['x'], self.food['y']
        if abs(fx - head['x']) > abs(fy - head['y']):
            food_dir = 'u' if fx < head['x'] else 'd'
        else:
            food_dir = 'l' if fy < head['y'] else 'r'

        return (dir_[0].lower(), food_dir, danger_left, danger_right, danger_straight)

            

            




def create_policy(num_iterations, q_table, epsilon=0.1):
    for episode in range(num_iterations):
        game = SimplifiedGameState()
        done = False
        state = game.reset()
        while not done:
            action = choose_action(state, q_table, epsilon)
            next_state, reward, done = game.step(action)
            update_q(q_table, state, action, reward, next_state)
            state = next_state
    return q_table


def to_json(updated_q_table, file_name):
    updated_q_table_json = {str(key): val for (key, val) in updated_q_table.items()}
    file_path = os.path.join(FILE_DIRECTORY, file_name)
    os.makedirs(FILE_DIRECTORY, exist_ok=True)

    with open(file_path, 'w') as json_file:
        json.dump(updated_q_table_json, json_file)
    



    

