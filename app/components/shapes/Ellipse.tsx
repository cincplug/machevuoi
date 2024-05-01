import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShapeWithControl } from "../../../types";

interface EllipseProps {
  shape: IShapeWithControl;
  title: string;
  onClick: () => void;
  isPreview?: boolean;
}

const Ellipse: React.FC<EllipseProps> = ({
  shape: { startPoint, controlPoint, endPoint },
  title,
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);
  const { x: cpx, y: cpy } = getPoint(controlPoint, isPreview);
  const { rx, ry, rotation } = getShapePoints({
    shape: "ellipses",
    startPoint: { x: spx, y: spy },
    endPoint: { x: epx, y: epy },
    controlPoint: { x: cpx, y: cpy }
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
    >
      <title>{title}</title>
    </ellipse>
  );
};

export default Ellipse;
