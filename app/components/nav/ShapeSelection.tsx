import React, { useState, useEffect } from "react";
import Dots from "../shapes/Dots";
import Preview from "../shapes/Preview";
import shapeComponents from "../shapes";
import { arraysAreEqual, getExtendedHandPoints } from "../../utils";
import { getShape } from "../../utils";
import { ISetup, UpdateSetupType, ShapeComponentsType } from "../../../types";

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

type AnyComponent = React.FC<any>;

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
      toggleDot(index);
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
    newScratchPoints[activeLayer] = newScratchPoints[activeLayer].includes(
      index
    )
      ? newScratchPoints[activeLayer].filter((point: number) => point !== index)
      : [...newScratchPoints[activeLayer], index];

    updateSetup({
      id: "scratchPoints",
      value: newScratchPoints,
      type: "hidden"
    });
  };

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

    const existingPathIndex = newScratchPoints[type].findIndex(
      (existingPath: []) => arraysAreEqual(existingPath, path)
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

  const isDots = activeLayer === "dots";
  const activeLayerSingular = activeLayer.slice(0, -1);
  const dotTooltip = !isDots
    ? `Click to set the ${
        !startPoint ? "start" : "next"
      } point of the new ${activeLayerSingular}`
    : "";

  return (
    <div className={`scratch-wrap active-${isDots ? "dots" : "shapes"}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 460 500"
        className="scratch-svg"
        onMouseMove={handleMouseMove}
      >
        {(Object.keys(shapeComponents) as (keyof ShapeComponentsType)[]).map(
          (shapeType) => {
            const ShapeComponent: AnyComponent = shapeComponents[shapeType];
            if (scratchPoints[shapeType].length === 0) return null;
            const shapes = getShape({
              selectedShapes: scratchPoints[shapeType],
              handlePathClick,
              shapeType
            });
            return (
              shapes &&
              shapes.map(({ shape, onClick }, index) => (
                <ShapeComponent
                  title={`Click to remove this ${activeLayerSingular}`}
                  key={`${JSON.stringify(shape)}-${index}`}
                  {...{ shape, onClick }}
                />
              ))
            );
          }
        )}
        {startPoint !== null && (
          <Preview
            {...{
              startPoint: extendedHandPoints[startPoint],
              controlPoint:
                controlPoint !== null ? extendedHandPoints[controlPoint] : null,
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
            {...{ dotTooltip }}
          />
        </g>
      </svg>
      <p className="scratch-info">
        Click dots to {isDots ? <>add or remove them</> : <>add <strong>{activeLayer}</strong></>}
      </p>
    </div>
  );
};

export default ShapeSelection;
