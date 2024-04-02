import React, { useState, useEffect } from "react";
import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { arraysHaveSameElements } from "../../utils";

const ScratchLines = ({ points, selectedLines, onLineClick }) => {
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [isAltDown, setIsAltDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setIsShiftDown(true);
      } else if (event.key === "Alt" || event.key === "Option") {
        setIsAltDown(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setIsShiftDown(false);
      } else if (event.key === "Alt" || event.key === "Option") {
        setIsAltDown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseOver = (start, end) => {
    if (isShiftDown) {
      onLineClick(start, end, "add");
    } else if (isAltDown) {
      onLineClick(start, end, "remove");
    }
  };

  return (
    <g className="scratch-points-layer">
      {points.flatMap((start, startIndex, arr) =>
        arr.slice(startIndex + 1).map((end, endIndex) => {
          const isSelected = selectedLines.some((line) =>
            arraysHaveSameElements(line, [start, end])
          );
          return (
            <line
              key={`${startIndex}-${endIndex}`}
              x1={HAND_POINTS[start].x}
              y1={HAND_POINTS[start].y}
              x2={HAND_POINTS[end].x}
              y2={HAND_POINTS[end].y}
              className={`scratch-points-line ${
                isSelected ? "selected" : "not-selected"
              }`}
              onMouseOver={() => handleMouseOver(start, end)}
              onClick={() => onLineClick(start, end, "toggle")}
            />
          );
        })
      )}
      {selectedLines.map((line, lineIndex) => {
        const [start, end] = line;
        return (
          <line
            key={`line-${lineIndex}-${start}-${end}`}
            x1={HAND_POINTS[start].x}
            y1={HAND_POINTS[start].y}
            x2={HAND_POINTS[end].x}
            y2={HAND_POINTS[end].y}
            className="scratch-points-line selected"
            onMouseOver={() => handleMouseOver(start, end)}
            onClick={() => onLineClick(start, end, "toggle")}
          />
        );
      })}
    </g>
  );
};

export default ScratchLines;
