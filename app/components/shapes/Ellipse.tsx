import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShapeWithControl } from "../../../types";

interface EllipseProps {
  shape: IShapeWithControl;
  onClick: () => void;
  isPreview?: boolean;
}

const Ellipse: React.FC<EllipseProps> = ({
  shape: { startPoint, controlPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);
  const { x: cpx, y: cpy } = getPoint(controlPoint, isPreview);
  const { rx, ry, rotation } = getShapePoints({
    shape: "ellipses",
    start: { x: spx, y: spy },
    end: { x: epx, y: epy },
    control: { x: cpx, y: cpy }
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
