import HP from "../../data/handPoints.json";

const Diamond = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const mpx = (spx + epx) / 2;
  const mpy = (spy + epy) / 2;

  const cpx = mpx - (epy - spy) / 2;
  const cpy = mpy + (epx - spx) / 2;
  const apx = mpx + (epy - spy) / 2;
  const apy = mpy - (epx - spx) / 2;

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy}  ${epx},${epy} ${apx},${apy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Diamond;
