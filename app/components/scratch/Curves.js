import HAND_POINTS from "../../data/defaultScratchPoints.json";

const points = HAND_POINTS.map((_, index) => index);

const Curves = ({ selectedCurves, handleConnector }) => {
  return (
    <g className={`scratch-layer curves`}>
      {points.flatMap((start, _startIndex, arr) =>
        arr.flatMap((control, _controlIndex) =>
          arr.map((end, _endIndex) => {
            if (start === control || start === end || control === end) {
              return null;
            }
            const curve = [start, control, end];
            const isSelected = selectedCurves.some((existingCurve) =>
              existingCurve.every((point, index) => point === curve[index])
            );
            return (
              isSelected && (
                <path
                  key={`${start}-${control}-${end}`}
                  d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
                  className={`scratch-curve ${
                    isSelected ? "selected" : "not-selected"
                  }`}
                  onClick={() =>
                    handleConnector({
                      start,
                      control,
                      end,
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
