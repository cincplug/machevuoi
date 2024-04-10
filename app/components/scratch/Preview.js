import HP from "../../data/handPoints.json";

const Preview = ({
  startPoint,
  controlPoint,
  mousePoint,
  activeLayer,
  shapeComponents
}) => {
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = mousePoint.x;
  const epy = mousePoint.y;
  if (controlPoint === null) {
    return (
      <line
        x1={spx}
        y1={spy}
        x2={epx}
        y2={epy}
        className="scratch-path preview control-path"
      />
    );
  }

  const cpx = HP[controlPoint].x;
  const cpy = HP[controlPoint].y;

  const ShapeComponent = shapeComponents[activeLayer];

  return (
    <>
      <path
        d={`M ${spx} ${spy} L ${cpx} ${cpy} L ${epx} ${epy}`}
        className="scratch-path preview control-path"
      />
      {ShapeComponent && (
        <ShapeComponent
          shape={[startPoint, controlPoint, mousePoint]}
          onClick={() => {}}
          isPreview
        />
      )}
    </>
  );
};

export default Preview;
