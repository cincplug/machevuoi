import HP from "../../data/handPoints.json";

const Diamond = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const midx = (spx + epx) / 2;
  const midy = (spy + epy) / 2;

  const cpx = midx - (epy - spy) / 2;
  const cpy = midy + (epx - spx) / 2;
  const apx = midx + (epy - spy) / 2;
  const apy = midy - (epx - spx) / 2;

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy}  ${epx},${epy} ${apx},${apy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Diamond;
