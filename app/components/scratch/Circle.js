import HP from "../../data/handPoints.json";

const Circle = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const mpx = (spx + epx) / 2;
  const mpy = (spy + epy) / 2;

  const radius = Math.sqrt((mpx - spx) ** 2 + (mpy - spy) ** 2);

  return (
    <circle
      cx={mpx}
      cy={mpy}
      r={radius}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Circle;
