import { getPoint } from "../../utils";
import { IPoint, ShapeComponentsType } from "../../../types";

interface PreviewProps {
  startPoint: IPoint;
  controlPoint: IPoint | null;
  mousePoint: IPoint | null;
  activeLayer: string;
  shapeComponents: ShapeComponentsType;
}

const Preview: React.FC<PreviewProps> = ({
  startPoint,
  controlPoint,
  mousePoint,
  activeLayer,
  shapeComponents
}) => {
  const { x: spx, y: spy } = getPoint(startPoint, true);
  if (mousePoint === null) {
    return null;
  }
  const epx = mousePoint.x;
  const epy = mousePoint.y;

  const ShapeComponent =
    shapeComponents[activeLayer as keyof ShapeComponentsType];

  if (controlPoint === null) {
    return ["lines", "curves", "ellipses"].includes(activeLayer) ? (
      <line
        x1={spx}
        y1={spy}
        x2={epx}
        y2={epy}
        className="scratch-path preview control-path"
      />
    ) : (
      <ShapeComponent
        shape={{ startPoint, controlPoint: startPoint, endPoint: mousePoint }}
        onClick={() => {}}
        title={activeLayer}
        isPreview
      />
    );
  }

  const { x: cpx, y: cpy } = getPoint(controlPoint, true);

  return (
    <>
      <path
        d={`M ${spx} ${spy} L ${cpx} ${cpy} L ${epx} ${epy}`}
        className="scratch-path preview control-path"
      />
      <ShapeComponent
        shape={{
          startPoint,
          controlPoint: controlPoint || startPoint,
          endPoint: mousePoint
        }}
        onClick={() => {}}
        isPreview
      />
    </>
  );
};

export default Preview;
