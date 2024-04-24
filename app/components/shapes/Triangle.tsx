import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types";

interface TriangleProps {
  shape: IShape;
  onClick: () => void;
  isPreview?: boolean;
}

const Triangle: React.FC<TriangleProps> = ({
  shape: { startPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { tpx, tpy } = getShapePoints({
    shape: "triangles",
    startPoint: { x: spx, y: spy },
    endPoint: { x: epx, y: epy }
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
