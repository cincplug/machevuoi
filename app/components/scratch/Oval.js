import HP from "../../data/handPoints.json";

const Oval = ({ shape: { startPoint, controlPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const cpx = HP[controlPoint].x;
  const cpy = HP[controlPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;
  const distControl = Math.sqrt((cpx - spx) ** 2 + (cpy - spy) ** 2);
  const distEnd = Math.sqrt((epx - spx) ** 2 + (epy - spy) ** 2);
  const rx = Math.max(distControl, distEnd);
  const ry = Math.min(distControl, distEnd);
  const rotation =
    distControl > distEnd
      ? Math.atan2(cpy - spy, cpx - spx)
      : Math.atan2(epy - spy, epx - spx);
  const rotationDeg = rotation * (180 / Math.PI);

  return (
    <ellipse
      cx={spx}
      cy={spy}
      rx={rx}
      ry={ry}
      transform={`rotate(${rotationDeg}, ${spx}, ${spy})`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Oval;
