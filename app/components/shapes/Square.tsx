import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types";

interface SquareProps {
  shape: IShape;
  onClick: () => void;
  isPreview?: boolean;
}

const Square: React.FC<SquareProps> = ({
  shape: { startPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { cpx, cpy, dpx, dpy } = getShapePoints({
    shape: "squares",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy }
  });

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${dpx},${dpy} ${epx},${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Square;
