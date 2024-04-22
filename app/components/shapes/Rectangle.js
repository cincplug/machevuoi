import HP from "../../data/handPoints.json";
import { getShapePoints } from "../../utils/shapeCalculators";

const Rectangle = ({
  shape: { startPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const { cpx, cpy, dpx, dpy } = getShapePoints({
    shape: "rectangles",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy }
  });

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${epx},${epy} ${dpx},${dpy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Rectangle;
