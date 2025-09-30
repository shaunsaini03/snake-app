import React, { useEffect, useState, useRef } from "react";
import { initialState, step, DIRS } from "../gameCore";
import GameView from "../components/GameView";
import HumanController from "../components/HumanController";
import AIController from "../components/AIController";
import ScoreBoard from "../components/ScoreBoard";
import "../styles/GamePage.css"

const TICK_MS = 300; // default tick speed in ms

const GamePage = ({ mode = "human" }) => {
  const [state, setState] = useState(initialState(10));
  const [lastAction, setLastAction] = useState(DIRS.RIGHT); // default move
  const intervalRef = useRef(null);
  const actionRef = useRef(DIRS.RIGHT);

  useEffect(() => {
    actionRef.current = lastAction;
  }, [lastAction]);


  // Handle ticking
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setState(prev => {
        // run one step of the game
        const { state: next, done } = step(prev, actionRef.current);
        if (done) {
          clearInterval(intervalRef.current);
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, []);

  // Reset game
  const handleRestart = () => {
    clearInterval(intervalRef.current);
    setState(initialState(10));
    setLastAction(DIRS.RIGHT);
  };

  return (
    <div className="game-page">
      <h1>{mode === "human" ? "Solo Snake" : "AI Snake"}</h1>

      <ScoreBoard score={state.score} />

      <GameView state={state} />

      {state.done && (
        <div>
          <h2>Game Over</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}

      {/* Controllers */}
      {mode === "human" && <HumanController onAction={setLastAction} />}
      {mode === "ai" && <AIController state={state} onAction={setLastAction} />}
    </div>
  );
};

export default GamePage;
