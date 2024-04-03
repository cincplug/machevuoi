import React, { useState } from "react";
import HAND_POINTS from "../../data/defaultScratchPoints.json";

const points = HAND_POINTS.map((_, index) => index);

function ScratchCurves({ selectedCurves, handleConnector, endPoint, controlPoint, setControlPoint }) {
  const [startPoint, setStartPoint] = useState(null);

  const handleDotClick = (index) => {
    if (!startPoint) {
      setStartPoint(index);
    } else if (!controlPoint) {
      setControlPoint(index);
    } else {
      handleConnector({
        start: startPoint,
        control: controlPoint,
        end: index,
        type: "curves",
        action: "toggle"
      });
      setStartPoint(null);
      setControlPoint(null);
    }
  };

  return (
    <g className={`scratch-points-layer curves ${startPoint ? "has-start-point" : "no-start-point"}`}>
      {points.flatMap((start, _startIndex, arr) =>
        arr.flatMap((control, _controlIndex) =>
          arr.map((end, _endIndex) => {
            if (start === control || start === end || control === end) {
              return null;
            }
            const curve = [start, control, end];
            const isSelected = selectedCurves.some((existingCurve) =>
              existingCurve.every((point, index) => point === curve[index])
            );
            return (
              <path
                key={`${start}-${control}-${end}`}
                d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
                className={`scratch-points-curve ${
                  isSelected ? "selected" : "not-selected"
                }`}
                onMouseOver={() =>
                  handleConnector({ start, control, end, type: "curves" })
                }
                onClick={() =>
                  handleConnector({
                    start,
                    control,
                    end,
                    type: "curves",
                    action: "toggle"
                  })
                }
              />
            );
          })
        )
      )}
      {HAND_POINTS.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={10}
          onClick={() => handleDotClick(index)}
          className="scratch-points-dot"
        >
          <title>{index}</title>
        </circle>
      ))}
      {startPoint != null && controlPoint != null && endPoint && (
        <path
          d={`M ${HAND_POINTS[startPoint].x} ${HAND_POINTS[startPoint].y} Q ${HAND_POINTS[controlPoint].x} ${HAND_POINTS[controlPoint].y} ${endPoint.x} ${endPoint.y}`}
          className="scratch-preview-connector"
        />
      )}
      {startPoint != null && controlPoint == null && endPoint && (
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

export default ScratchCurves;
