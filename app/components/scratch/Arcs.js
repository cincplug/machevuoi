import HP from "../../data/handPoints.json";

const points = HP.map((_, index) => index);

const Arcs = ({ selectedArcs, handlePathClick }) => {
  return (
    <g className={`scratch-layer paths`}>
      {points.flatMap((startPoint, _startIndex, arr) =>
        arr.flatMap((controlPoint, _controlIndex) =>
          arr.map((endPoint, _endIndex) => {
            if (
              startPoint === controlPoint ||
              startPoint === endPoint ||
              controlPoint === endPoint
            ) {
              return null;
            }
            const arc = [startPoint, controlPoint, endPoint];
            const isSelected = selectedArcs.some((existingArc) =>
              existingArc.every((point, index) => point === arc[index])
            );
            const cp1x = HP[startPoint].x + (HP[controlPoint].x - HP[startPoint].x) / 2;
            const cp1y = HP[startPoint].y + (HP[controlPoint].y - HP[startPoint].y) / 2;
            const cp2x = HP[controlPoint].x + (HP[endPoint].x - HP[controlPoint].x) / 2;
            const cp2y = HP[controlPoint].y + (HP[endPoint].y - HP[controlPoint].y) / 2;
            return (
              isSelected && (
                <path
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  d={`M ${HP[startPoint].x} ${HP[startPoint].y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${HP[endPoint].x} ${HP[endPoint].y}`}
                  className={`scratch-path ${
                    isSelected ? "selected" : "not-selected"
                  }`}
                  onClick={() =>
                    handlePathClick({
                      start: startPoint,
                      control: controlPoint,
                      end: endPoint,
                      type: "arcs"
                    })
                  }
                />
              )
            );
          })
        )
      )}
    </g>
  );
};

export default Arcs;
