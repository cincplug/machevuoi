import HP from "../../data/handPoints.json";

const Preview = ({ startPoint, endPoint, controlPoint, activeLayer }) => {
  return (
    <>
      {controlPoint !== null ? (
        <>
          <path
            d={`M ${HP[startPoint].x} ${HP[startPoint].y} L ${HP[controlPoint].x} ${HP[controlPoint].y} L ${endPoint.x} ${endPoint.y}`}
            className="scratch-preview-path control-path"
          />
          {activeLayer === "curves" && (
            <path
              d={`M ${HP[startPoint].x} ${HP[startPoint].y} Q ${HP[controlPoint].x} ${HP[controlPoint].y} ${endPoint.x} ${endPoint.y}`}
              className="scratch-preview-path"
            />
          )}
          {activeLayer === "arcs" &&
            (() => {
              const cp1x = HP[startPoint].x + (HP[controlPoint].x - HP[startPoint].x) / 2;
              const cp1y = HP[startPoint].y + (HP[controlPoint].y - HP[startPoint].y) / 2;
              const cp2x = HP[controlPoint].x + (endPoint.x - HP[controlPoint].x) / 2;
              const cp2y = HP[controlPoint].y + (endPoint.y - HP[controlPoint].y) / 2;
              return (
                <path
                  d={`M ${HP[startPoint].x} ${HP[startPoint].y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endPoint.x} ${endPoint.y}`}
                  className="scratch-preview-path"
                />
              );
            })()}
          {activeLayer === "ovals" &&
            (() => {
              const rx =
                (Math.abs(HP[controlPoint].x - HP[startPoint].x) +
                  Math.abs(endPoint.x - HP[startPoint].x)) /
                2;
              const ry =
                (Math.abs(HP[controlPoint].y - HP[startPoint].y) +
                  Math.abs(endPoint.y - HP[startPoint].y)) /
                2;

              return (
                <ellipse
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  cx={HP[startPoint].x}
                  cy={HP[startPoint].y}
                  rx={rx}
                  ry={ry}
                  className="scratch-preview-path"
                />
              );
            })()}
        </>
      ) : (
        <line
          x1={HP[startPoint].x}
          y1={HP[startPoint].y}
          x2={endPoint.x}
          y2={endPoint.y}
          className="scratch-preview-path"
        />
      )}
    </>
  );
};

export default Preview;
