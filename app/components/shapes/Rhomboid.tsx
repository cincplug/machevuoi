import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types";

interface RhomboidProps {
  shape: IShape;
  onClick: () => void;
  isPreview?: boolean;
}

const Rhomboid: React.FC<RhomboidProps> = ({
  shape: { startPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { cpx, cpy, dpx, dpy } = getShapePoints({
    shape: "rhomboids",
    startPoint: { x: spx, y: spy },
    endPoint: { x: epx, y: epy }
  });

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${epx},${epy} ${dpx},${dpy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Rhomboid;
