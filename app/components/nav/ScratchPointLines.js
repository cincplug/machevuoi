import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { arraysAreEqual } from "../../utils";

const ScratchPointLines = ({ points, selectedLines, onLineClick }) => {
  return (
    <g className="scratch-points-layer">
      {points.flatMap((start, startIndex, arr) =>
        arr
          .slice(startIndex + 1)
          .map((end, endIndex) => (
            <line
              key={`${startIndex}-${endIndex}`}
              x1={HAND_POINTS[start].x}
              y1={HAND_POINTS[start].y}
              x2={HAND_POINTS[end].x}
              y2={HAND_POINTS[end].y}
              className={`scratch-points-line ${
                selectedLines.some((line) => arraysAreEqual(line, [start, end]))
                  ? "selected"
                  : "not-selected"
              }`}
              onClick={() => onLineClick(start, end)}
            />
          ))
      )}
    </g>
  );
};
export default ScratchPointLines;
