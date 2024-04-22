import HP from "../../data/handPoints.json";
import { getShapePoints } from "../../utils/shapeCalculators";

const Circle = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

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
