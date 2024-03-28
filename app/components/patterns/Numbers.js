import React from "react";
import { processColor } from "../../utils";

const Numbers = ({ points, setup, flatMask }) => {
  return (flatMask.length ? flatMask : points).map(
    (flatMaskPoint, pointIndex) => {
      const point = points[flatMask.length ? flatMaskPoint : pointIndex];
      if (!point) return null;
      return (
        <text
          key={`n-${pointIndex}`}
          fill={processColor(setup.color, setup.opacity)}
          x={point.x - setup.radius}
          y={point.y}
          className={`number-mask`}
        >
          {pointIndex}
        </text>
      );
    }
  );
};

export default Numbers;
