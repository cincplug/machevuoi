import HP from "../../data/handPoints.json";

const Square = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const cpx = spx - (epy - spy);
  const cpy = spy + (epx - spx);
  const dpx = epx - (epy - spy);
  const dpy = epy + (epx - spx);

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${dpx},${dpy} ${epx},${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Square;
