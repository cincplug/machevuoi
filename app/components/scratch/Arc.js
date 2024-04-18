import HP from "../../data/handPoints.json";

const Arc = ({ shape: { startPoint, endPoint }, onClick, isPreview = false }) => {
  
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const mpx = (spx + epx) / 2;
  const mpy = (spy + epy) / 2;

  const slope = -(spx - epx) / (spy - epy);

  const distance = Math.sqrt((spx - epx)**2 + (spy - epy)**2) / 2;

  const cpx = mpx + distance / Math.sqrt(1 + slope**2);
  const cpy = mpy + slope * (cpx - mpx);

  return (
    <path
      d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Arc;
