// Celebration.js - Enhanced confetti effect
import React, { useEffect, useState } from "react";
import "./Celebration.css";

const Celebration = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#4ade80', '#f97316'][
        Math.floor(Math.random() * 6)
      ],
      size: 8 + Math.random() * 8,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="celebration-container">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
          }}
        />
      ))}
      <div className="celebration-emoji">🎉</div>
    </div>
  );
};

export default Celebration;
