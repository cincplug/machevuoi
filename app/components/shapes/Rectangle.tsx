import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types";

interface RectangleProps {
  shape: IShape;
  title: string;
  onClick: () => void;
  isPreview?: boolean;
}

const Rectangle: React.FC<RectangleProps> = ({
  shape: { startPoint, endPoint },
  title,
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { cpx, cpy, dpx, dpy } = getShapePoints({
    shape: "rectangles",
    startPoint: { x: spx, y: spy },
    endPoint: { x: epx, y: epy }
  });

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${epx},${epy} ${dpx},${dpy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    >
      <title>{title}</title>
    </polygon>
  );
};

export default Rectangle;
