import HP from "../../data/handPoints.json";

const points = HP.map((_, index) => index);

const Curves = ({ selectedCurves, handlePathClick }) => {
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
            const curve = [startPoint, controlPoint, endPoint];
            const isSelected = selectedCurves.some((existingCurve) =>
              existingCurve.every((point, index) => point === curve[index])
            );
            const spx = HP[startPoint].x;
            const spy = HP[startPoint].y;
            const cpx = HP[controlPoint].x;
            const cpy = HP[controlPoint].y;
            const epx = HP[endPoint].x;
            const epy = HP[endPoint].y;
            return (
              isSelected && (
                <path
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  d={`M ${spx} ${spy} Q ${cpx} ${cpy} ${epx} ${epy}`}
                  className={`scratch-path ${
                    isSelected ? "selected" : "not-selected"
                  }`}
                  onClick={() =>
                    handlePathClick({
                      start: startPoint,
                      control: controlPoint,
                      end: endPoint,
                      type: "curves"
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

export default Curves;
