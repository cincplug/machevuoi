import HP from "../../data/handPoints.json";

const Circle = ({ shape, onClick, isPreview = false }) => {
  const [startPoint, endPoint] = shape;
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = isPreview ? endPoint.x : HP[endPoint].x;
  const epy = isPreview ? endPoint.y : HP[endPoint].y;

  // Calculate the distance between the start and end points to determine the radius
  const radius = Math.sqrt((epx - spx) ** 2 + (epy - spy) ** 2);

  return (
    <circle
      cx={spx}
      cy={spy}
      r={radius}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
    />
  );
};

export default Circle;
