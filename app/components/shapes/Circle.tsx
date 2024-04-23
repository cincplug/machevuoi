import React from "react";
import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types";

interface CircleProps {
  shape: IShape;
  onClick: () => void;
  isPreview?: boolean;
}

const Circle: React.FC<CircleProps> = ({
  shape: { startPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { mpx, mpy, circleRadius } = getShapePoints({
    shape: "circles",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy }
  });

  return (
    <circle
      cx={mpx}
      cy={mpy}
      r={circleRadius}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Circle;
