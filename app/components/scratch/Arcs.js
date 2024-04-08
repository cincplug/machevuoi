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
            return (
              isSelected && (
                <path
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  d={`M ${HP[startPoint].x} ${HP[startPoint].y} A ${Math.abs(
                    HP[controlPoint].x - HP[startPoint].x
                  )} ${Math.abs(HP[controlPoint].y - HP[startPoint].y)} 0 0 0 ${
                    HP[endPoint].x
                  } ${HP[endPoint].y}`}
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
