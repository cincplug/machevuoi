import HP from "../../data/handPoints.json";

const Triangle = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const dx = epx - spx;
  const dy = epy - spy;

  const tpx = (spx + epx) / 2 - Math.sqrt(3) * (epy - spy) / 2;
  const tpy = (spy + epy) / 2 + Math.sqrt(3) * (epx - spx) / 2;

  return (
    <polygon
      points={`${spx},${spy} ${tpx},${tpy} ${epx},${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Triangle;
