import HAND_POINTS from "../../data/defaultScratchPoints.json";
const points = HAND_POINTS.map((_, index) => index);

const ScratchCurves = ({ selectedCurves, handleConnector }) => {
  const type = "curves";

  return (
    <g className="scratch-points-layer">
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
              <path
                key={`${start}-${control}-${end}`}
                d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
                className={`scratch-points-curve ${
                  isSelected ? "selected" : "not-selected"
                }`}
                onMouseOver={() =>
                  handleConnector({ start, control, end, type })
                }
                onClick={() =>
                  handleConnector({
                    start,
                    control,
                    end,
                    type,
                    action: "toggle"
                  })
                }
              />
            );
          })
        )
      )}
      {selectedCurves.map((curve, curveIndex) => {
        const [start, control, end] = curve;
        return (
          <path
            key={`curve-${curveIndex}-${start}-${control}-${end}`}
            d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
            className="scratch-points-curve selected"
            onMouseOver={() => handleConnector({ start, control, end, type })}
            onClick={() =>
              handleConnector({
                start,
                control,
                end,
                type,
                action: "toggle"
              })
            }
          />
        );
      })}
    </g>
  );
};
export default ScratchCurves;
