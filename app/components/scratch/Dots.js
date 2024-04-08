import React from "react";
import HAND_POINTS from "../../data/defaultScratchPoints.json";

function Dots({ selectedDots, handleDotClick }) {
  return (
    <g className={`scratch-layer dots`}>
      {HAND_POINTS.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={12}
          onClick={() => handleDotClick(index)}
          className={`scratch-dot ${
            selectedDots.includes(index) ? "selected" : "not-selected"
          }`}
        >
          <title>{index}</title>
        </circle>
      ))}
    </g>
  );
}

export default Dots;
