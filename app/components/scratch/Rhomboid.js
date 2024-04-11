import HP from "../../data/handPoints.json";

const Square = ({ shape, onClick, isPreview = false }) => {
  const [startPoint, endPoint] = shape;
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const midx = (spx + epx) / 2;
  const midy = (spy + epy) / 2;

  const halfDiagonal = Math.sqrt((midx - spx) ** 2 + (midy - spy) ** 2);

  const cpx = midx - halfDiagonal;
  const cpy = midy + halfDiagonal;
  const dpx = midx + halfDiagonal;
  const dpy = midy - halfDiagonal;

  return (
    <polygon
      points={`${spx},${spy} ${cpx},${cpy} ${epx},${epy} ${dpx},${dpy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Square;

  
