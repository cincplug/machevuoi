import HP from "../../data/handPoints.json";

const Preview = ({ startPoint, endPoint, controlPoint, mousePoint, activeLayer }) => { 
  const spx = HP[startPoint].x;
  const spy = HP[startPoint].y;
  const epx = mousePoint.x;
  const epy = mousePoint.y;
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
          const midX = (spx + epx) / 2;
          const midY = (spy + epy) / 2;
          const slope = -(spx - epx) / (spy - epy);
          const distance = Math.sqrt((spx - epx) ** 2 + (spy - epy) ** 2) / 2;
          const cpx = midX + distance / Math.sqrt(1 + slope ** 2);
          const cpy = midY + slope * (cpx - midX);
          return (
            <path
              d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
              className="scratch-preview-path"
            />
          );
        })()}
      {activeLayer === "ovals" &&
        (() => {
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
              key={`${startPoint}-${controlPoint}-${endPoint}`}
              cx={spx}
              cy={spy}
              rx={rx}
              ry={ry}
              transform={`rotate(${rotationDeg}, ${spx}, ${spy})`}
              className="scratch-preview-path"
            />
          );
        })()}
    </>
  );
};

export default Preview;
