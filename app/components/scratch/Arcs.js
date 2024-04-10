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
            const epx = HP[endPoint].x;
            const epy = HP[endPoint].y;

            const midX = (spx + epx) / 2;
            const midY = (spy + epy) / 2;

            const slope = -(spx - epx) / (spy - epy);

            const distance = Math.sqrt((spx - epx)**2 + (spy - epy)**2) / 2;

            const cpx = midX + distance / Math.sqrt(1 + slope**2);
            const cpy = midY + slope * (cpx - midX);

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
