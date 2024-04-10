import HP from "../../data/handPoints.json";

const Arc = ({ shape, onClick, isPreview = false }) => {
  const [startPoint, controlPoint, endPoint] = shape;
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  const midX = (spx + epx) / 2;
  const midY = (spy + epy) / 2;

  const slope = -(spx - epx) / (spy - epy);

  const distance = Math.sqrt((spx - epx)**2 + (spy - epy)**2) / 2;

  const cpx = midX + distance / Math.sqrt(1 + slope**2);
  const cpy = midY + slope * (cpx - midX);

  return (
    <path
      key={`${startPoint}-${controlPoint}-${endPoint}`}
      d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Arc;
