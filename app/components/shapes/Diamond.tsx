import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types"; 

interface DiamondProps {
  shape: IShape;
  onClick: () => void;
  isPreview?: boolean;
}

const Diamond: React.FC<DiamondProps> = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { cpx, cpy, apx, apy } = getShapePoints({
    shape: "diamonds",
    startPoint: { x: spx, y: spy },
    endPoint: { x: epx, y: epy }
  });

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy}  ${epx},${epy} ${apx},${apy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Diamond;
