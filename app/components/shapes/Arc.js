import HP from "../../data/handPoints.json";
import { getShapePoints } from "../../utils/shapeCalculators";

const Arc = ({
  shape: { startPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const { cpx, cpy } = getShapePoints({
    shape: "arcs",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy }
  });

  return (
    <path
      d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Arc;
