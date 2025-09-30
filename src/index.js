// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import reportWebVitals from "./reportWebVitals";

import Home from "./pages/Home";
import SnakeGame from "./components/SnakeGame";
import HowToPlay from "./pages/HowToPlay";
import GamePage from "./pages/GamePage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<GamePage mode="human" />} />
        <Route path="/play-ai" element={<GamePage mode="ai" />} />
        {/* <Route path="/how-to" element={<HowToPlay />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
