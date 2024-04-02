import React, { useState } from "react";
import HAND_POINTS from "../../data/defaultScratchPoints.json";
import ScratchLines from "./ScratchLines";
import ScratchCurves from "./ScratchCurves";
import { arraysHaveSameElements } from "../../utils";

function ScratchPoints({ setup, handleInputChange }) {
  const [activeLayer, setActiveLayer] = useState("dots");
  const [isZoomed, setIsZoomed] = useState(false);
  const { scratchPoints, minimum } = setup;

  const handlePointClick = (index) => {
    const newScratchPoints = { ...scratchPoints };
    newScratchPoints[activeLayer] = newScratchPoints[activeLayer].includes(
      index
    )
      ? newScratchPoints[activeLayer].filter((point) => point !== index)
      : [...newScratchPoints[activeLayer], index];

    handleInputChange({
      target: {
        id: "scratchPoints",
        value: newScratchPoints,
        type: "hidden"
      }
    });
  };

  const handleLineClick = (start, end, command) => {
    const newScratchPoints = { ...scratchPoints };
    const line = [start, end].sort((a, b) => a - b);
    const existingLineIndex = newScratchPoints.lines.findIndex((existingLine) =>
      arraysHaveSameElements(existingLine, line)
    );

    if (command === "add" && existingLineIndex === -1) {
      newScratchPoints.lines = [...newScratchPoints.lines, line];
    } else if (command === "remove" && existingLineIndex !== -1) {
      newScratchPoints.lines = [
        ...newScratchPoints.lines.slice(0, existingLineIndex),
        ...newScratchPoints.lines.slice(existingLineIndex + 1)
      ];
    } else if (command === "toggle") {
      if (existingLineIndex !== -1) {
        newScratchPoints.lines = [
          ...newScratchPoints.lines.slice(0, existingLineIndex),
          ...newScratchPoints.lines.slice(existingLineIndex + 1)
        ];
      } else {
        newScratchPoints.lines = [...newScratchPoints.lines, line];
      }
    }

    handleInputChange({
      target: {
        id: "scratchPoints",
        value: newScratchPoints,
        type: "hidden"
      }
    });
  };

  const handleCurveClick = (start, control, end, command) => {
    const newScratchPoints = { ...scratchPoints };
    const curve = [start, control, end];
    const existingCurveIndex = newScratchPoints.curves.findIndex(
      (existingCurve) => arraysHaveSameElements(existingCurve, curve)
    );
    if (command === "add" && existingCurveIndex === -1) {
      newScratchPoints.curves = [...newScratchPoints.curves, curve];
    } else if (command === "remove" && existingCurveIndex !== -1) {
      newScratchPoints.curves = [
        ...newScratchPoints.curves.slice(0, existingCurveIndex),
        ...newScratchPoints.curves.slice(existingCurveIndex + 1)
      ];
    } else if (command === "toggle") {
      if (existingCurveIndex !== -1) {
        newScratchPoints.curves = [
          ...newScratchPoints.curves.slice(0, existingCurveIndex),
          ...newScratchPoints.curves.slice(existingCurveIndex + 1)
        ];
      } else {
        newScratchPoints.curves = [...newScratchPoints.curves, curve];
      }
    }

    handleInputChange({
      target: {
        id: "scratchPoints",
        value: newScratchPoints,
        type: "hidden"
      }
    });
  };

  const selectAllDots = () => {
    const newScratchPoints = {
      ...scratchPoints,
      dots: HAND_POINTS.map((_, index) => index)
    };
    handleInputChange({
      target: {
        id: "scratchPoints",
        value: newScratchPoints,
        type: "hidden"
      }
    });
  };

  const handleMagnifyClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className={`scratch-points-wrap active-${activeLayer}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-20 -20 500 540"
        className={`scratch-points-svg ${isZoomed ? "zoomed" : "not-zoomed"}`}
      >
        {activeLayer === "dots" && (
          <g
            className={`scratch-points-layer dots ${
              activeLayer === "dots" ? "active" : "not-active"
            }`}
          >
            {HAND_POINTS.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={15}
                onClick={() => handlePointClick(index)}
                className={`scratch-points-dot ${
                  scratchPoints.dots.includes(index)
                    ? "selected"
                    : "not-selected"
                }`}
              >
                {index}
              </circle>
            ))}
          </g>
        )}
        {activeLayer === "lines" && (
          <ScratchLines
            selectedLines={scratchPoints.lines}
            onLineClick={handleLineClick}
          />
        )}
        {activeLayer === "curves" && (
          <ScratchCurves
            selectedCurves={scratchPoints.curves}
            onCurveClick={handleCurveClick}
          />
        )}
      </svg>
      {["dots", "lines", "curves"].map((layer, index) => (
        <button
          className={`layer-button ${layer === activeLayer ? "active" : ""}`}
          key={index}
          onClick={() => setActiveLayer(layer)}
        >
          {layer}
        </button>
      ))}
      <button
        onClick={handleMagnifyClick}
        className="scratch-points-zoom layer-button"
      >
        +
      </button>
    </div>
  );
}

export default ScratchPoints;
