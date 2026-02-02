import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import Food from "./components/Food";
import Snake from "./components/Snake";
import Celebration from "./components/Celebration";

// Method to get random x & y number between 0-96 for random food position
const randomFoodPosition = () => {
  const pos = { x: 0, y: 0 };
  let x = Math.floor(Math.random() * 96);
  let y = Math.floor(Math.random() * 96);
  pos.x = x - (x % 4);
  pos.y = y - (y % 4);
  return pos;
};

const initialSnake = {
  snake: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 8, y: 0 },
  ],
  direction: "ArrowRight",
  speed: 150,
};

// Opposite directions to prevent 180° turns
const oppositeDirections = {
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
};

function App() {
  const [snake, setSnake] = useState(initialSnake.snake);
  const [lastDirection, setLastDirection] = useState(initialSnake.direction);
  const [foodPosition, setFoodPosition] = useState(randomFoodPosition);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(initialSnake.speed);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("snakeGameHighScore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const playgroundRef = useRef();
  const directionRef = useRef(lastDirection);

  // Update ref when direction changes
  useEffect(() => {
    directionRef.current = lastDirection;
  }, [lastDirection]);

  // Check for self-collision
  const checkSelfCollision = useCallback((snakeArray) => {
    const head = snakeArray[snakeArray.length - 1];
    for (let i = 0; i < snakeArray.length - 1; i++) {
      if (snakeArray[i].x === head.x && snakeArray[i].y === head.y) {
        return true;
      }
    }
    return false;
  }, []);

  // Update high score
  const updateHighScore = useCallback((score) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snakeGameHighScore", score.toString());
      setIsNewHighScore(true);
    }
  }, [highScore]);

  // Game loop
  useEffect(() => {
    if (!isStarted || isPaused) return;

    const head = snake[snake.length - 1];

    // Wall collision
    if (head.x >= 100 || head.x < 0 || head.y >= 100 || head.y < 0) {
      setGameOver(true);
      updateHighScore(snake.length - 3);
      return;
    }

    // Self collision
    if (checkSelfCollision(snake)) {
      setGameOver(true);
      updateHighScore(snake.length - 3);
      return;
    }

    const interval = setInterval(move, speed);
    return () => clearInterval(interval);
  });

  // Speed increase with score
  useEffect(() => {
    const score = snake.length - 3;
    const newSpeed = Math.max(50, initialSnake.speed - score * 5);
    setSpeed(newSpeed);
  }, [snake.length]);

  const move = () => {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x;
    let y = tmpSnake[tmpSnake.length - 1].y;

    switch (directionRef.current) {
      case "ArrowUp":
        y -= 4;
        break;
      case "ArrowRight":
        x += 4;
        break;
      case "ArrowDown":
        y += 4;
        break;
      case "ArrowLeft":
        x -= 4;
        break;
      default:
        break;
    }

    tmpSnake.push({ x, y });

    if (x !== foodPosition.x || y !== foodPosition.y) {
      tmpSnake.shift();
    } else {
      setFoodPosition(randomFoodPosition());
    }
    setSnake(tmpSnake);
  };

  const handleKeyDown = (e) => {
    // Pause/Resume
    if (e.key === "p" || e.key === "P" || e.key === "Escape") {
      if (isStarted && !gameOver) {
        setIsPaused(!isPaused);
      }
      return;
    }

    // Direction change (prevent 180° turn)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      if (oppositeDirections[e.key] !== directionRef.current) {
        setLastDirection(e.key);
      }
    }
  };

  const startGame = () => {
    setIsStarted(true);
    setIsPaused(false);
    playgroundRef.current.focus();
  };

  const restartGame = () => {
    setIsStarted(true);
    setGameOver(false);
    setSnake(initialSnake.snake);
    setLastDirection(initialSnake.direction);
    setSpeed(initialSnake.speed);
    setIsNewHighScore(false);
    setIsPaused(false);
    playgroundRef.current.focus();
  };

  const score = snake.length - 3;

  return (
    <div
      className="App"
      onKeyDown={handleKeyDown}
      ref={playgroundRef}
      tabIndex={0}
    >
      {/* Header */}
      <div className="game-header">
        <h1 className="game-title">🐍 Snake Game</h1>
        <div className="high-score">🏆 Best: {highScore}</div>
      </div>

      {/* Game Area */}
      <div className="game-area">
        {isStarted && !gameOver && (
          <div className={`score-display ${isNewHighScore ? "new-record" : ""}`}>
            Score: {score}
            {isNewHighScore && <span className="record-badge">NEW!</span>}
          </div>
        )}

        {!isStarted && (
          <div className="start-screen">
            <button onClick={startGame} className="game-btn start-btn">
              🎮 Start Game
            </button>
            <div className="instructions">
              <p>Use <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> to move</p>
              <p>Press <kbd>P</kbd> or <kbd>Esc</kbd> to pause</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-over-screen">
            <Celebration />
            <div className="game-over-text">Game Over!</div>
            <div className="final-score">
              Score: {score}
              {isNewHighScore && <span className="new-high-score-text">🎉 New High Score!</span>}
            </div>
            <button onClick={restartGame} className="game-btn restart-btn">
              🔄 Play Again
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="pause-overlay">
            <div className="pause-text">⏸️ PAUSED</div>
            <p>Press P or Esc to resume</p>
          </div>
        )}

        <Snake snake={snake} />
        {!gameOver && <Food position={foodPosition} />}
      </div>

      {/* Speed indicator */}
      {isStarted && !gameOver && (
        <div className="speed-indicator">
          Speed: {Math.round((initialSnake.speed / speed) * 100)}%
        </div>
      )}
    </div>
  );
}

export default App;
