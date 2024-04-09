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
            const rx =
              (Math.abs(HP[controlPoint].x - HP[startPoint].x) +
                Math.abs(HP[endPoint].x - HP[startPoint].x)) /
              2;
            const ry =
              (Math.abs(HP[controlPoint].y - HP[startPoint].y) +
                Math.abs(HP[endPoint].y - HP[startPoint].y)) /
              2;

            return (
              isSelected && (
                <ellipse
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  cx={HP[startPoint].x}
                  cy={HP[startPoint].y}
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
