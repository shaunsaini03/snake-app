// components/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Snake Game</h1>
      <div className="button-group">
        <button onClick={() => alert("Use arrow keys to control the snake.\nEat food, don’t crash!")}>
          How to Play
        </button>
        <button onClick={() => navigate("/play")}>
          Play Solo Snake
        </button>
        <button onClick={() => navigate("/play-ai")}>
          Play Against AI
        </button>
      </div>
    </div>
  );
};

export default Home;
