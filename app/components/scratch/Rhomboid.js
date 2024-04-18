import HP from "../../data/handPoints.json";

const Square = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const mpx = (spx + epx) / 2;
  const mpy = (spy + epy) / 2;

  const halfDiagonal = Math.sqrt((mpx - spx) ** 2 + (mpy - spy) ** 2);

  const cpx = mpx - halfDiagonal;
  const cpy = mpy + halfDiagonal;
  const dpx = mpx + halfDiagonal;
  const dpy = mpy - halfDiagonal;

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${epx},${epy} ${dpx},${dpy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Square;

  
