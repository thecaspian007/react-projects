import React, { useEffect, useState, useCallback } from "react";
import "./HomePage.css";

const DIFFICULTY_SETTINGS = {
  easy: { time: 15, label: "Easy (15s)", color: "#4ade80" },
  medium: { time: 10, label: "Medium (10s)", color: "#fbbf24" },
  hard: { time: 5, label: "Hard (5s)", color: "#f87171" },
};

function HomePage() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");
  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem("counterGameHighScores");
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [clickAnimation, setClickAnimation] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timer === 0) {
      // Check for high score when timer ends
      if (count > 0 && count > highScores[difficulty]) {
        const newHighScores = { ...highScores, [difficulty]: count };
        setHighScores(newHighScores);
        localStorage.setItem("counterGameHighScores", JSON.stringify(newHighScores));
        setIsNewHighScore(true);
        setTimeout(() => setIsNewHighScore(false), 3000);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, count, difficulty, highScores]);

  // Keyboard support for clicking
  const handleKeyDown = useCallback(
    (e) => {
      if (e.code === "Space" && timer > 0) {
        e.preventDefault();
        handleClick();
      }
    },
    [timer]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleClick = () => {
    if (timer > 0) {
      setCount((prev) => prev + 1);
      setClickAnimation(true);
      setTimeout(() => setClickAnimation(false), 100);
    }
  };

  const startGame = () => {
    setTimer(DIFFICULTY_SETTINGS[difficulty].time);
    setCount(0);
    setIsNewHighScore(false);
  };

  const resetGame = () => {
    setCount(0);
    setTimer(0);
    setIsNewHighScore(false);
  };

  const isPlaying = timer > 0;
  const totalTime = DIFFICULTY_SETTINGS[difficulty].time;
  const progressPercent = isPlaying ? (timer / totalTime) * 100 : 100;

  return (
    <div className="home-container">
      {/* Background particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ "--delay": `${i * 0.5}s` }} />
        ))}
      </div>

      {/* Header */}
      <h1 className="game-title">
        ⚡ Click Speed Challenge ⚡
      </h1>

      {/* High Score Badge */}
      <div className="high-score-badge">
        🏆 Best: {highScores[difficulty]}
      </div>

      {/* Timer Progress Bar */}
      <div className="timer-container">
        <div className="timer-bar">
          <div
            className="timer-fill"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: DIFFICULTY_SETTINGS[difficulty].color,
            }}
          />
        </div>
        <div className="timer-text">{timer}s</div>
      </div>

      {/* Count Display */}
      <div className={`home-count ${clickAnimation ? "pulse" : ""} ${isNewHighScore ? "new-record" : ""}`}>
        {count}
        {isNewHighScore && <span className="new-record-badge">🎉 NEW RECORD!</span>}
      </div>

      {/* Difficulty Selector */}
      {!isPlaying && (
        <div className="difficulty-selector">
          {Object.entries(DIFFICULTY_SETTINGS).map(([key, value]) => (
            <button
              key={key}
              className={`difficulty-btn ${difficulty === key ? "active" : ""}`}
              onClick={() => setDifficulty(key)}
              style={{ "--btn-color": value.color }}
            >
              {value.label}
            </button>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="button-group">
        {!isPlaying ? (
          <button className="home-btn-start btn glow" onClick={startGame}>
            🚀 START
          </button>
        ) : (
          <button className="home-btn-click btn" onClick={handleClick}>
            👆 CLICK ME!
          </button>
        )}
        <button className="home-btn-reset btn" onClick={resetGame}>
          🔄 RESET
        </button>
      </div>

      {/* Instructions */}
      <div className="instructions">
        {isPlaying ? (
          <span>Click as fast as you can! (or press SPACEBAR)</span>
        ) : (
          <span>Select difficulty and press START</span>
        )}
      </div>
    </div>
  );
}

export default HomePage;