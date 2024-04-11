import HP from "../../data/handPoints.json";

const Square = ({ shape, onClick, isPreview = false }) => {
  const [startPoint, endPoint] = shape;
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  // Calculate the side length (distance between start and end points)
  const sideLength = Math.sqrt((epx - spx) ** 2 + (epy - spy) ** 2);

  // Calculate the other two corners of the square
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
