import React from "react";

// Snake component with gradient coloring
function Snake({ snake }) {
  return (
    <div>
      {snake.map((box, i) => {
        // Calculate gradient intensity (tail to head)
        const intensity = (i / (snake.length - 1)) * 100;
        const baseColor = `hsl(210, 90%, ${30 + intensity * 0.4}%)`;
        const isHead = i === snake.length - 1;

        return (
          <div
            key={i}
            style={{
              width: isHead ? "20px" : "16px",
              height: isHead ? "20px" : "16px",
              backgroundColor: baseColor,
              borderRadius: "50%",
              position: "absolute",
              left: `${box.x}%`,
              top: `${box.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: i + 1,
              boxShadow: isHead
                ? "0 0 15px rgba(59, 130, 246, 0.8), inset 0 0 5px rgba(255,255,255,0.3)"
                : "0 0 8px rgba(59, 130, 246, 0.4)",
              transition: "width 0.1s, height 0.1s",
              border: isHead ? "2px solid rgba(255,255,255,0.5)" : "none",
            }}
          >
            {/* Eyes for the head */}
            {isHead && (
              <>
                <div
                  style={{
                    position: "absolute",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    top: "4px",
                    left: "3px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    top: "4px",
                    right: "3px",
                  }}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Snake;