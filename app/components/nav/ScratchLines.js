import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { arraysHaveSameElements } from "../../utils";
const points = HAND_POINTS.map((_, index) => index);

const ScratchLines = ({ selectedLines, handleConnector }) => {
  const type = "lines";
  return (
    <g className="scratch-points-layer">
      {points.flatMap((start, startIndex, arr) =>
        arr.slice(startIndex + 1).map((end, endIndex) => {
          const isSelected = selectedLines.some((line) =>
            arraysHaveSameElements(line, [start, end])
          );
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
              onMouseOver={() =>
                handleConnector({
                  start,
                  end,
                  type
                })
              }
              onClick={() =>
                handleConnector({
                  start,
                  end,
                  type,
                  action: "toggle"
                })
              }
            />
          );
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
            onMouseOver={() =>
              handleConnector({
                start,
                end,
                type
              })
            }
            onClick={() =>
              handleConnector({
                start,
                end,
                type,
                action: "toggle"
              })
            }
          />
        );
      })}
    </g>
  );
};

export default ScratchLines;
