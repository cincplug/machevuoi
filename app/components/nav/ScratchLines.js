import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { arraysHaveSameElements } from "../../utils";

const ScratchLines = ({ points, selectedLines, onLineClick }) => {
  return (
    <g className="scratch-points-layer">
      {points.flatMap((start, startIndex, arr) =>
        arr
          .slice(startIndex + 1)
          .map((end, endIndex) => {
            const isSelected = selectedLines.some((line) =>
              arraysHaveSameElements(line, [start, end])
            );
            if (!isSelected) {
              return (
                <line
                  key={`${startIndex}-${endIndex}`}
                  x1={HAND_POINTS[start].x}
                  y1={HAND_POINTS[start].y}
                  x2={HAND_POINTS[end].x}
                  y2={HAND_POINTS[end].y}
                  className={`scratch-points-line ${
                    isSelected ? "selected" : "not-selected"
                  }`}
                  onClick={() => onLineClick(start, end)}
                />
              );
            }
          })
      )}
      {selectedLines.map((line, lineIndex) => {
        const [start, end] = line;
        return (
          <line
            key={`line-${lineIndex}-${start}-${end}`}
            x1={HAND_POINTS[start].x}
            y1={HAND_POINTS[start].y}
            x2={HAND_POINTS[end].x}
            y2={HAND_POINTS[end].y}
            className="scratch-points-line selected"
            onClick={() => onLineClick(start, end)}
          />
        );
      })}
    </g>
  );
};
export default ScratchLines;
