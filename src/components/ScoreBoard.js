
import React from "react";
import "../styles/ScoreBoard.css";

const ScoreBoard = ({ score }) => {
  return (
    <div className="scoreboard">
      <h2>Score</h2>
      <div className="score-value">{score}</div>
    </div>
  );
};

export default ScoreBoard;
