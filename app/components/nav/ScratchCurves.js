import React, { useState, useEffect } from 'react';
import HAND_POINTS from "../../data/defaultScratchPoints.json";

const points = HAND_POINTS.map((_, index) => index);

const ScratchCurves = ({ selectedCurves, onCurveClick }) => {
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [isAltDown, setIsAltDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Shift') {
        setIsShiftDown(true);
      } else if (event.key === 'Alt' || event.key === 'Option') {
        setIsAltDown(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Shift') {
        setIsShiftDown(false);
      } else if (event.key === 'Alt' || event.key === 'Option') {
        setIsAltDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseOver = (start, control, end) => {
    if (isShiftDown) {
      onCurveClick(start, control, end, 'add');
    } else if (isAltDown) {
      onCurveClick(start, control, end, 'remove');
    }
  };

  return (
    <g className="scratch-points-layer">
      {points.flatMap((start, _startIndex, arr) =>
        arr.flatMap((control, _controlIndex) =>
          arr.map((end, _endIndex) => {
            if (start === control || start === end || control === end) {
              return null;
            }
            const curve = [start, control, end];
            const isSelected = selectedCurves.some(
              (existingCurve) =>
                existingCurve.every((point, index) => point === curve[index])
            );
            return (
              <path
                key={`${start}-${control}-${end}`}
                d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
                className={`scratch-points-curve ${
                  isSelected ? "selected" : "not-selected"
                }`}
                onMouseOver={() => handleMouseOver(start, control, end)}
                onClick={() => onCurveClick(start, control, end, 'toggle')}
              />
            );
          })
        )
      )}
      {selectedCurves.map((curve, curveIndex) => {
        const [start, control, end] = curve;
        return (
          <path
            key={`curve-${curveIndex}-${start}-${control}-${end}`}
            d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
            className="scratch-points-curve selected"
            onMouseOver={() => handleMouseOver(start, control, end)}
            onClick={() => onCurveClick(start, control, end, 'toggle')}
          />
        );
      })}
    </g>
  );
};
export default ScratchCurves;
