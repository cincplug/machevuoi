import HAND_POINTS from "../../data/defaultScratchPoints.json";

const Preview = ({ startPoint, endPoint, controlPoint }) => {
  return (
    <>
      {controlPoint !== null ? (
        <>
          <path
            d={`M ${HAND_POINTS[startPoint].x} ${HAND_POINTS[startPoint].y} L ${HAND_POINTS[controlPoint].x} ${HAND_POINTS[controlPoint].y} L ${endPoint.x} ${endPoint.y}`}
            className="scratch-preview-connector control-line"
          />
          <path
            d={`M ${HAND_POINTS[startPoint].x} ${HAND_POINTS[startPoint].y} Q ${HAND_POINTS[controlPoint].x} ${HAND_POINTS[controlPoint].y} ${endPoint.x} ${endPoint.y}`}
            className="scratch-preview-connector"
          />
        </>
      ) : (
        <line
          x1={HAND_POINTS[startPoint].x}
          y1={HAND_POINTS[startPoint].y}
          x2={endPoint.x}
          y2={endPoint.y}
          className="scratch-preview-connector"
        />
      )}
    </>
  );
};

export default Preview;
