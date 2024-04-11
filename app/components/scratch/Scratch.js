import React, { useState } from "react";
import Dots from "./Dots";
import Arc from "./Arc";
import Line from "./Line";
import Square from "./Square";
import Diamond from "./Diamond";
import Rhomboid from "./Rhomboid";
import Rectangle from "./Rectangle";
import Triangle from "./Triangle";
import Curve from "./Curve";
import Circle from "./Circle";
import Oval from "./Oval";
import Preview from "./Preview";
import { arraysHaveSameElements } from "../../utils";
import { getShape } from "../../utils";

function Scratch({ setup, handleInputChange }) {
  const [activeLayer, setActiveLayer] = useState("dots");
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, _setEndPoint] = useState(null);
  const [controlPoint, setControlPoint] = useState(null);
  const [mousePoint, setMousePoint] = useState(null);
  const { scratchPoints } = setup;

  const handleDotClick = (index) => {
    if (activeLayer === "dots") {
      toggleDot(index);
    } else {
      if (startPoint === null) {
        setStartPoint(index);
      } else if (
        ["curves", "arcs", "ovals"].includes(activeLayer) &&
        controlPoint === null
      ) {
        setControlPoint(index);
      } else {
        handlePathClick({
          start: startPoint,
          control: controlPoint,
          end: index,
          type: activeLayer
        });
        setStartPoint(null);
        setControlPoint(null);
      }
    }
  };

  const toggleDot = (index) => {
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

  const handlePathClick = ({ start, control, end, type }) => {
    const newScratchPoints = { ...scratchPoints };
    const path = control
      ? [start, control, end]
      : [start, end].sort((a, b) => a - b);
  
    const existingPathIndex = newScratchPoints[type].findIndex((existingPath) =>
      arraysHaveSameElements(existingPath, path)
    );
  
    const addNewPath = () => {
      newScratchPoints[type] = [...newScratchPoints[type], path];
    };
  
    const removePath = () => {
      newScratchPoints[type] = [
        ...newScratchPoints[type].slice(0, existingPathIndex),
        ...newScratchPoints[type].slice(existingPathIndex + 1)
      ];
    };
  
    const isNewPath = existingPathIndex === -1;
    isNewPath ? addNewPath() : removePath();
  
    handleInputChange({
      target: {
        id: "scratchPoints",
        value: newScratchPoints,
        type: "hidden"
      }
    });
  };  

  const handleMouseMove = (event) => {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x, y } = point.matrixTransform(svg.getScreenCTM().inverse());
    setMousePoint({ x, y });
  };

  const shapeComponents = {
    arcs: Arc,
    lines: Line,
    squares: Square,
    diamonds: Diamond,
    rectangles: Rectangle,
    rhomboids: Rhomboid,
    triangles: Triangle,
    curves: Curve,
    circles: Circle,
    ovals: Oval
  };

  return (
    <div
      className={`scratch-wrap active-${
        activeLayer === "dots" ? "dots" : "paths"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 460 500"
        className="scratch-svg"
        onMouseMove={handleMouseMove}
      >
        {Object.keys(shapeComponents).map((shapeType) => {
          const ShapeComponent = shapeComponents[shapeType];
          const shapes = getShape(
            scratchPoints[shapeType],
            handlePathClick,
            shapeType
          );
          return shapes.map(({ shape, onClick }, index) => (
            <ShapeComponent
              key={`${shape.join("-")}-${index}`}
              {...{ shape, onClick }}
            />
          ));
        })}
        {startPoint !== null && (
          <Preview
            {...{
              startPoint,
              endPoint,
              controlPoint,
              activeLayer,
              mousePoint,
              shapeComponents
            }}
          />
        )}
        <g className={`scratch-layer dots`}>
          <Dots
            selectedDots={scratchPoints.dots}
            handleDotClick={handleDotClick}
          />
        </g>
      </svg>
      {[
        "dots",
        "lines",
        "curves",
        "arcs",
        "circles",
        "ovals",
        "squares",
        "diamonds",
        "rhomboids",
        "rectangles",
        "triangles"
      ].map((layer, index) => (
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
    </div>
  );
}

export default Scratch;
