import { IPoint } from "../../../types";
import { getPoint, stripTextPrefix } from "../../utils";
import { getShapeComponent, isKnownShape } from "../shapes";
import Bitmap from "./Bitmap";

interface PreviewProps {
  startPoint: IPoint;
  controlPoint: IPoint | null;
  mousePoint: IPoint | null;
  activeLayer: string;
}

const Preview: React.FC<PreviewProps> = ({
  startPoint,
  controlPoint,
  mousePoint,
  activeLayer
}) => {
  if (!mousePoint) return null;

  // Handle text preview
  if (activeLayer.startsWith('text:')) {
    const ShapeComponent = getShapeComponent(activeLayer);
    return (
      <ShapeComponent
        shape={{
          startPoint,
          endPoint: mousePoint,
          controlPoint: startPoint
        }}
        text={stripTextPrefix(activeLayer)}
        title=""
        onClick={() => {}}
        isPreview={true}
      />
    );
  }

  const { x: spx, y: spy } = getPoint(startPoint, true);
  const epx = mousePoint.x;
  const epy = mousePoint.y;

  const ShapeComponent = getShapeComponent(activeLayer);

  if (controlPoint === null) {
    if (!isKnownShape(activeLayer)) {
      return (
        <Bitmap
          shape={{
            startPoint: { x: spx, y: spy },
            endPoint: { x: epx, y: epy }
          }}
          isPreview={true}
          title=""
          onClick={() => {}}
          url={activeLayer}
        />
      );
    }

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
        shape={{
          startPoint: { x: spx, y: spy },
          controlPoint: controlPoint || startPoint,
          endPoint: { x: epx, y: epy }
        }}
        isPreview={true}
        title=""
        onClick={() => {}}
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
        title={activeLayer}
        isPreview
      />
    </>
  );
};

export default Preview;
