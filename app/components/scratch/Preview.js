import HP from "../../data/handPoints.json";

const Preview = ({ startPoint, endPoint, controlPoint, activeLayer }) => {
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = endPoint.x;
  const epy = endPoint.y;
  if (controlPoint === null) {
    return (
      <line
        x1={spx}
        y1={spy}
        x2={epx}
        y2={epy}
        className="scratch-preview-path"
      />
    );
  }
  const cpx = HP[controlPoint].x;
  const cpy = HP[controlPoint].y;
  return (
    <>
      <path
        d={`M ${spx} ${spy} L ${cpx} ${cpy} L ${epx} ${epy}`}
        className="scratch-preview-path control-path"
      />
      {activeLayer === "curves" && (
        <path
          d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
          className="scratch-preview-path"
        />
      )}
      {activeLayer === "arcs" &&
        (() => {
          const cp1x = spx + (cpx - spx) / 2;
          const cp1y = spy + (cpy - spy) / 2;
          const cp2x = cpx + (epx - cpx) / 2;
          const cp2y = cpy + (epy - cpy) / 2;
          return (
            <path
              d={`M ${spx} ${spy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${epx} ${epy}`}
              className="scratch-preview-path"
            />
          );
        })()}
      {activeLayer === "ovals" &&
        (() => {
          const rx = (Math.abs(cpx - spx) + Math.abs(epx - spx)) / 2;
          const ry = (Math.abs(cpy - spy) + Math.abs(epy - spy)) / 2;
          return (
            <ellipse
              key={`${startPoint}-${controlPoint}-${endPoint}`}
              cx={spx}
              cy={spy}
              rx={rx}
              ry={ry}
              className="scratch-preview-path"
            />
          );
        })()}
    </>
  );
};

export default Preview;
