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
            const distControl = Math.sqrt((cpx - spx)**2 + (cpy - spy)**2);
            const distEnd = Math.sqrt((epx - spx)**2 + (epy - spy)**2);
            const rx = Math.max(distControl, distEnd);
            const ry = Math.min(distControl, distEnd);
            const rotation = (distControl > distEnd) ? Math.atan2(cpy - spy, cpx - spx) : Math.atan2(epy - spy, epx - spx);
            const rotationDeg = rotation * (180 / Math.PI);

            return (
              isSelected && (
                <ellipse
                  key={`${startPoint}-${controlPoint}-${endPoint}`}
                  cx={spx}
                  cy={spy}
                  rx={rx}
                  ry={ry}
                  transform={`rotate(${rotationDeg}, ${spx}, ${spy})`}
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
