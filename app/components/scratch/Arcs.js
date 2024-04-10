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
            const spx = HP[startPoint].x;
            const spy = HP[startPoint].y;
            const cpx = HP[controlPoint].x;
            const cpy = HP[controlPoint].y;
            const epx = HP[endPoint].x;
            const epy = HP[endPoint].y;
            const cp1x = spx + (cpx - spx) / 2;
            const cp1y = spy + (cpy - spy) / 2;
            const cp2x = cpx + (epx - cpx) / 2;
            const cp2y = cpy + (epy - cpy) / 2;
            return (
              isSelected && (
                <path
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  d={`M ${spx} ${spy} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${epx} ${epy}`}
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
