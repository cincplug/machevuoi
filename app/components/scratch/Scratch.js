import React, { useState } from "react";
import Dots from "./Dots";
import Lines from "./Lines";
import Curves from "./Curves";
import { arraysHaveSameElements } from "../../utils";

function Scratch({ setup, handleInputChange }) {
  const [activeLayer, setActiveLayer] = useState("dots");
  const [isZoomed, setIsZoomed] = useState(false);
  const [endPoint, setEndPoint] = useState(null);
  const [controlPoint, setControlPoint] = useState(null);
  const { scratchPoints, pressedKey } = setup;
  const isAdding = pressedKey === "Shift";
  const isRemoving = pressedKey === "Alt";

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

  const handleConnector = ({ start, control, end, type, isToggling }) => {
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

    if (isAdding && isNewConnector) {
      addNewConnector();
    } else if (isRemoving && !isNewConnector) {
      removeConnector();
    } else if (isToggling) {
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
    <div className={`scratch-wrap active-${activeLayer} ${isRemoving ? "is-removing" : "not-removing"}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-20 -20 500 540"
        className={`scratch-svg ${isZoomed ? "zoomed" : "not-zoomed"}`}
        onMouseMove={handleMouseMove}
      >
        {activeLayer === "dots" && (
          <Dots
          selectedDots={scratchPoints.dots}
          handleDotClick={handlePointClick}
        />
        )}
        {activeLayer === "lines" && (
          <Lines
            {...{ handleConnector, endPoint }}
            selectedLines={scratchPoints.lines}
          />
        )}
        {activeLayer === "curves" && (
          <Curves
            {...{ handleConnector, endPoint, controlPoint, setControlPoint }}
            selectedCurves={scratchPoints.curves}
          />
        )}
      </svg>
      {["dots", "lines", "curves"].map((layer, index) => (
        <button
          className={`scratch-layer-button ${
            layer === activeLayer ? "active" : ""
          }`}
          key={index}
          onClick={() => setActiveLayer(layer)}
        >
          {layer}
        </button>
      ))}
      <button
        onClick={handleMagnifyClick}
        className="scratch-layer-button zoom"
      >
        ◲
      </button>
    </div>
  );
}

export default Scratch;
