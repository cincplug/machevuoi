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
          {activeLayer === "arcs" && (
            <path
              d={`M ${HP[startPoint].x} ${HP[startPoint].y} A ${Math.abs(
                HP[controlPoint].x - HP[startPoint].x
              )} ${Math.abs(HP[controlPoint].y - HP[startPoint].y)} 0 0 0 ${
                endPoint.x
              } ${endPoint.y}`}
              className="scratch-preview-path"
            />
          )}
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
