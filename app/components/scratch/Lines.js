import HP from "../../data/handPoints.json";
import { arraysHaveSameElements } from "../../utils";

const points = HP.map((_, index) => index);

const Lines = ({ selectedLines, handlePathClick }) => {
  return (
    <g className={`scratch-layer paths`}>
      {points.flatMap((startPoint, startIndex, arr) =>
        arr.slice(startIndex + 1).map((endPoint, endIndex) => {
          const isSelected = selectedLines.some((line) =>
            arraysHaveSameElements(line, [startPoint, endPoint])
          );
          return (
            isSelected && (
              <line
                key={`${startIndex}-${endIndex}`}
                x1={HP[startPoint].x}
                y1={HP[startPoint].y}
                x2={HP[endPoint].x}
                y2={HP[endPoint].y}
                className={`scratch-path ${
                  isSelected ? "selected" : "not-selected"
                }`}
                onClick={() =>
                  handlePathClick({
                    start: startPoint,
                    end: endPoint,
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
