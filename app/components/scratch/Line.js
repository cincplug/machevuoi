import HP from "../../data/handPoints.json";

const Line = ({ shape, onClick }) => {
  const [startPoint, endPoint] = shape;
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = HP[endPoint].x;
  const epy = HP[endPoint].y;

  return (
    <line
      key={`${startPoint}-${endPoint}`}
      x1={spx}
      y1={spy}
      x2={epx}
      y2={epy}
      className="scratch-path"
      onClick={onClick}
    />
  );
};

export default Line;
