import React, { useState } from "react";
import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { arraysHaveSameElements } from "../../utils";

const points = HAND_POINTS.map((_, index) => index);

function ScratchLines({ selectedLines, handleConnector, endPoint }) {
  const [startPoint, setStartPoint] = useState(null);

  const handleDotClick = (index) => {
    if (!startPoint) {
      setStartPoint(index);
    } else {
      handleConnector({
        start: startPoint,
        end: index,
        type: "lines",
        isToggling: true
      });
      setStartPoint(null);
    }
  };

  return (
    <g
      className={`scratch-layer lines ${
        startPoint ? "has-start-point" : "no-start-point"
      }`}
    >
      {points.flatMap((start, startIndex, arr) =>
        arr.slice(startIndex + 1).map((end, endIndex) => {
          const isSelected = selectedLines.some((line) =>
            arraysHaveSameElements(line, [start, end])
          );
          return isSelected && (
            <line
              key={`${startIndex}-${endIndex}`}
              x1={HAND_POINTS[start].x}
              y1={HAND_POINTS[start].y}
              x2={HAND_POINTS[end].x}
              y2={HAND_POINTS[end].y}
              className={`scratch-line ${
                isSelected ? "selected" : "not-selected"
              }`}
              // onMouseOver={() =>
              //   handleConnector({
              //     start,
              //     end,
              //     type: "lines"
              //   })
              // }
              onClick={() =>
                handleConnector({
                  start,
                  end,
                  type: "lines",
                  isToggling: true
                })
              }
            />
          );
        })
      )}
      {HAND_POINTS.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={10}
          onClick={() => handleDotClick(index)}
          className="scratch-dot"
        >
          <title>{index}</title>
        </circle>
      ))}
      {startPoint !== null && endPoint && (
        <line
          x1={HAND_POINTS[startPoint].x}
          y1={HAND_POINTS[startPoint].y}
          x2={endPoint.x}
          y2={endPoint.y}
          className="scratch-preview-connector"
        />
      )}
    </g>
  );
}

export default ScratchLines;
