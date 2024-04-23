import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShapeWithControl } from "../../../types";

interface CurveProps {
  shape: IShapeWithControl;
  onClick: () => void;
  isPreview?: boolean;
}

const Curve: React.FC<CurveProps> = ({
  shape: { startPoint, controlPoint, endPoint },
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);
  const { x: cpx, y: cpy } = getPoint(controlPoint, isPreview);

  return (
    <path
      d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Curve;
