import { ISetup, UpdateSetupType, ShapeComponentsType } from "../../../types";
import React, { useState, useEffect } from "react";
import { getShapeComponent, isKnownShape } from "../shapes";
import shapeComponents from "../shapes";
import {
  arraysAreEqual,
  getExtendedHandPoints,
  isBitmapSource,
  isSpecialShape,
  stripTextPrefix
} from "../../utils";
import { getShape } from "../../utils";
import Dots from "../shapes/Dots";
import Preview from "../shapes/Preview";

interface IProps {
  setup: ISetup;
  updateSetup: (event: UpdateSetupType) => void;
}

interface IPathClick {
  startPoint: number;
  controlPoint: number | null;
  endPoint: number;
  type: string;
}

const extendedHandPoints = getExtendedHandPoints();

const ShapeSelection: React.FC<IProps> = ({ setup, updateSetup }) => {
  const [startPoint, setStartPoint] = useState<number | null>(null);
  const [controlPoint, setControlPoint] = useState<number | null>(null);
  const [mousePoint, setMousePoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const { scratchPoints, activeLayer } = setup;

  const handleDotClick = (index: number) => {
    if (activeLayer === "dots") {
      toggleDot(index as unknown as number);
    } else {
      if (startPoint === null) {
        setStartPoint(index);
      } else if (
        ["curves", "ellipses"].includes(activeLayer) &&
        controlPoint === null
      ) {
        setControlPoint(index);
      } else {
        handlePathClick({
          startPoint,
          controlPoint,
          endPoint: index,
          type: activeLayer
        });
        setStartPoint(null);
        setControlPoint(null);
      }
    }
  };

  useEffect(() => {
    if (setup.pressedKey === "Escape") {
      setStartPoint(null);
      setControlPoint(null);
    }
  }, [setup.pressedKey]);

  const toggleDot = (index: number) => {
    const newScratchPoints = { ...scratchPoints };
    if (activeLayer === "dots") {
      const currentArray = newScratchPoints.dots;
      newScratchPoints.dots = currentArray?.includes(index)
        ? currentArray.filter((point: number) => point !== index)
        : [...currentArray, index];
    }

    updateSetup({
      id: "scratchPoints",
      value: newScratchPoints,
      type: "hidden"
    });
  };

  const clearScratchPoints = () => {
    updateSetup({
      id: "scratchPoints",
      value: {},
      type: "hidden"
    });
  }

  const handlePathClick = ({
    startPoint,
    controlPoint,
    endPoint,
    type
  }: IPathClick) => {
    const newScratchPoints = { ...scratchPoints };
    const path = controlPoint
      ? [startPoint, controlPoint, endPoint]
      : [startPoint, endPoint];

    if (!newScratchPoints[type]) {
      newScratchPoints[type] = [];
    }

    const existingPathIndex = newScratchPoints[type].findIndex(
      (existingPath: number[]) => arraysAreEqual(existingPath, path)
    );

    if (existingPathIndex === -1) {
      newScratchPoints[type] = [...newScratchPoints[type], path];
    } else {
      newScratchPoints[type] = [
        ...newScratchPoints[type].slice(0, existingPathIndex),
        ...newScratchPoints[type].slice(existingPathIndex + 1)
      ];
    }

    updateSetup({
      id: "scratchPoints",
      value: newScratchPoints,
      type: "hidden"
    });
  };

  const handleMouseMove = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const svg = event.currentTarget as unknown as SVGSVGElement;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const ctm = svg.getScreenCTM();
    if (ctm !== null) {
      const { x, y } = point.matrixTransform(ctm.inverse());
      setMousePoint({ x, y });
    }
  };

  const getLabelForShape = (shapeType: string) => {
    if (shapeType.startsWith('text:')) {
      return shapeType.substring(5); // Remove 'text:' prefix
    }
    return isKnownShape(shapeType) ? shapeType : "bitmap";
  };

  const isDots = activeLayer === "dots";
  const dotTooltip = !isDots
    ? `Click to set the ${
        !startPoint ? "start" : "next"
      } point of the new ${activeLayer}`
    : "";

  return (
    <div className={`scratch-wrap active-${isDots ? "dots" : "shapes"}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 460 500"
        className="scratch-svg"
        onMouseMove={handleMouseMove}
      >
        {[
          ...Object.keys(shapeComponents),
          ...Object.keys(scratchPoints).filter(isSpecialShape)
        ].map((shapeType) => {
          const ShapeComponent = getShapeComponent(shapeType);

          const shapes = scratchPoints[shapeType]
            ? getShape({
                selectedShapes: scratchPoints[shapeType],
                handlePathClick,
                shapeType
              })
            : null;

          return shapes?.map(({ shape, onClick }, index) => (
            <ShapeComponent
              key={`${shapeType}-${index}`}
              title={`Click to remove from ${getLabelForShape(shapeType)}`}
              shape={shape as any}
              onClick={onClick}
              {...(shapeType.startsWith('text:') 
                ? { text: stripTextPrefix(shapeType) }
                : isBitmapSource(shapeType) 
                  ? { url: shapeType }
                  : {}
              )}
            />
          ));
        })}
        {startPoint !== null && (
          <Preview
            startPoint={extendedHandPoints[startPoint]}
            controlPoint={
              controlPoint !== null ? extendedHandPoints[controlPoint] : null
            }
            activeLayer={activeLayer}
            mousePoint={mousePoint}
          />
        )}
        <g className="scratch-layer dots">
          <Dots
            selectedDots={scratchPoints.dots}
            handleDotClick={handleDotClick}
            dotTooltip={dotTooltip}
          />
        </g>
      </svg>
      <p className="scratch-info">
        Click dots to{" "}
        {isDots ? (
          <>add or remove them</>
        ) : (
          <>
            add{" "}
            <strong>
              {activeLayer.startsWith('text:') 
                ? `text "${activeLayer.substring(5)}"` 
                : isKnownShape(activeLayer) 
                  ? activeLayer 
                  : "bitmaps"}
            </strong>
          </>
        )}
      </p>
      <button className="control button icon-button clear-scratch" onClick={clearScratchPoints}>Clear</button>
    </div>
  );
};

export default ShapeSelection;
