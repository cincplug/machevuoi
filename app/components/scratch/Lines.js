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
          const spx = HP[startPoint].x;
          const spy = HP[startPoint].y;
          const epx = HP[endPoint].x;
          const epy = HP[endPoint].y;
          return (
            isSelected && (
              <line
                key={`${startIndex}-${endIndex}`}
                x1={spx}
                y1={spy}
                x2={epx}
                y2={epy}
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
