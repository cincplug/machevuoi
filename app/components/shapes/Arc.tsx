import { getPoint } from "../../utils";
import { getShapePoints } from "../../utils/shapeCalculators";
import { IShape } from "../../../types";

interface ArcProps {
  shape: IShape;
  title: string;
  onClick: () => void;
  isPreview?: boolean;
}

const Arc: React.FC<ArcProps> = ({
  shape: { startPoint, endPoint },
  title,
  onClick,
  isPreview = false
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const { cpx, cpy } = getShapePoints({
    shape: "arcs",
    startPoint: { x: spx, y: spy },
    endPoint: { x: epx, y: epy }
  });

  return (
    <path
      d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    >
      <title>{title}</title>
    </path>
  );
};

export default Arc;
