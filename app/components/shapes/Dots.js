import React from "react";
import HP from "../../data/handPoints.json";

function Dots({ selectedDots, handleDotClick }) {
  return HP.map((point, index) => (
    <circle
      key={index}
      cx={point.x}
      cy={point.y}
      r={12}
      onClick={() => handleDotClick(index)}
      className={`scratch-dot ${
        selectedDots && selectedDots.includes(index) ? "selected" : "not-selected"
      }`}
    >
      <title>{index}</title>
    </circle>
  ));
}

export default Dots;