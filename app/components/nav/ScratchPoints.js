import React, { useState } from "react";
import HAND_POINTS from "../../data/defaultScratchPoints.json";
import ScratchLines from "./ScratchLines";
import ScratchCurves from "./ScratchCurves";
import { arraysHaveSameElements } from "../../utils";

function ScratchPoints({ setup, handleInputChange }) {
  const [activeLayer, setActiveLayer] = useState("dots");
  const [isZoomed, setIsZoomed] = useState(false);
  const [endPoint, setEndPoint] = useState(null);
  const [controlPoint, setControlPoint] = useState(null);
  const { scratchPoints, pressedKey } = setup;

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

  const handleConnector = ({ start, control, end, type, action }) => {
    const newScratchPoints = { ...scratchPoints };
    const connector =
      type === "lines"
        ? [start, end].sort((a, b) => a - b)
        : [start, control, end];
    const existingConnectorIndex = newScratchPoints[type].findIndex(
      (existingConnector) =>
        arraysHaveSameElements(existingConnector, connector)
    );

    const addNewConnector = () => {
      newScratchPoints[type] = [...newScratchPoints[type], connector];
    };

    const removeConnector = () => {
      newScratchPoints[type] = [
        ...newScratchPoints[type].slice(0, existingConnectorIndex),
        ...newScratchPoints[type].slice(existingConnectorIndex + 1)
      ];
    };

    const isNewConnector = existingConnectorIndex === -1;

    if (pressedKey === "Shift" && isNewConnector) {
      addNewConnector();
    } else if (pressedKey === "Alt" && !isNewConnector) {
      removeConnector();
    } else if (action === "toggle") {
      isNewConnector ? addNewConnector() : removeConnector();
    }

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

 const handleMouseMove = (event) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    const viewBoxWidth = event.currentTarget.viewBox.animVal.width;
    const scaleFactor = svgRect.width / viewBoxWidth;
    setEndPoint({
      x: (event.clientX - svgRect.left - 10) / scaleFactor,
      y: (event.clientY - svgRect.top - 10) / scaleFactor
    });
  };

  return (
    <div className={`scratch-points-wrap active-${activeLayer}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-20 -20 500 540"
        className={`scratch-points-svg ${isZoomed ? "zoomed" : "not-zoomed"}`}
        onMouseMove={handleMouseMove}
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
            {...{ handleConnector, endPoint }}
            selectedLines={scratchPoints.lines}
          />
        )}
        {activeLayer === "curves" && (
          <ScratchCurves
            {...{ handleConnector, endPoint, controlPoint, setControlPoint }}
            selectedCurves={scratchPoints.curves}
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
