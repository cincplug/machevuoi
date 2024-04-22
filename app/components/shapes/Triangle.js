import HP from "../../data/handPoints.json";
import { getShapePoints } from "../../utils/shapeCalculators";

const Triangle = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const { tpx, tpy } = getShapePoints({
    shape: "triangles",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy }
  });

  return (
    <polygon
      points={`${spx},${spy} ${tpx},${tpy} ${epx},${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Triangle;
