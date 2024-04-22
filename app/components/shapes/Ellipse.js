import HP from "../../data/handPoints.json";
import { getShapePoints } from "../../utils/shapeCalculators";

const Ellipse = ({ shape: { startPoint, controlPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const cpx = HP[controlPoint].x;
  const cpy = HP[controlPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;
  const { rx, ry, rotation } = getShapePoints({
    shape: "ellipses",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy },
    control: { x: cpx, y: cpy}
  });
  const rotationDeg = rotation * (180 / Math.PI);

  return (
    <ellipse
      cx={spx}
      cy={spy}
      rx={rx}
      ry={ry}
      transform={`rotate(${rotationDeg}, ${spx}, ${spy})`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Ellipse;
