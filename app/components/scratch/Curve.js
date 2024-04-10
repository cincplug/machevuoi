import HP from "../../data/handPoints.json";

const Curve = ({ shape, onClick, isPreview = false }) => {
  const [startPoint, controlPoint, endPoint] = shape;
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const cpx = HP[controlPoint].x;
  const cpy = HP[controlPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  return (
    <path
      d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Curve;
