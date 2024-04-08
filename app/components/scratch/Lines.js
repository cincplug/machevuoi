import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { arraysHaveSameElements } from "../../utils";

const points = HAND_POINTS.map((_, index) => index);

const Lines = ({ selectedLines, handleConnector }) => {
  return (
    <g className={`scratch-layer lines`}>
      {points.flatMap((start, startIndex, arr) =>
        arr.slice(startIndex + 1).map((end, endIndex) => {
          const isSelected = selectedLines.some((line) =>
            arraysHaveSameElements(line, [start, end])
          );
          return (
            isSelected && (
              <line
                key={`${startIndex}-${endIndex}`}
                x1={HAND_POINTS[start].x}
                y1={HAND_POINTS[start].y}
                x2={HAND_POINTS[end].x}
                y2={HAND_POINTS[end].y}
                className={`scratch-line ${
                  isSelected ? "selected" : "not-selected"
                }`}
                onClick={() =>
                  handleConnector({
                    start,
                    end,
                    type: "lines"
                  })
                }
              />
            )
          );
        })
      )}
    </g>
  );
};

export default Lines;
