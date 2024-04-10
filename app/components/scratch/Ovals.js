import HP from "../../data/handPoints.json";

const points = HP.map((_, index) => index);

const Ovals = ({ selectedOvals, handlePathClick }) => {
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
            const oval = [startPoint, controlPoint, endPoint];
            const isSelected = selectedOvals.some((existingOval) =>
              existingOval.every((point, index) => point === oval[index])
            );
            const spx = HP[startPoint].x;
            const spy = HP[startPoint].y;
            const cpx = HP[controlPoint].x;
            const cpy = HP[controlPoint].y;
            const epx = HP[endPoint].x;
            const epy = HP[endPoint].y;
            const rx = (Math.abs(cpx - spx) + Math.abs(epx - spx)) / 2;
            const ry = (Math.abs(cpy - spy) + Math.abs(epy - spy)) / 2;

            return (
              isSelected && (
                <ellipse
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  cx={spx}
                  cy={spy}
                  rx={rx}
                  ry={ry}
                  className={`scratch-path selected`}
                  onClick={() =>
                    handlePathClick({
                      start: startPoint,
                      control: controlPoint,
                      end: endPoint,
                      type: "ovals"
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

export default Ovals;
