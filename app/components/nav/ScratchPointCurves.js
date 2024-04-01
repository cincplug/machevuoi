import HAND_POINTS from "../../data/defaultScratchPoints.json";
import { processColor } from "../../utils";

const ScratchPointCurves = ({ points, selectedCurves, onCurveClick }) => {
  return (
    <g className="scratch-points-layer">
      {points.flatMap((start, _startIndex, arr) =>
        arr.flatMap((control, _controlIndex) =>
          arr.map((end) => {
            if (start === control || start === end || control === end) {
              return null;
            }
            const curve = [start, control, end];
            const isSelected = selectedCurves.some(
              (existingCurve) =>
                existingCurve.every((point, index) => point === curve[index])
            );
            if (!isSelected) {
              return (
                <path
                  key={`${start}-${control}-${end}`}
                  d={`M ${HAND_POINTS[start].x} ${HAND_POINTS[start].y} Q ${HAND_POINTS[control].x} ${HAND_POINTS[control].y} ${HAND_POINTS[end].x} ${HAND_POINTS[end].y}`}
                  className={`scratch-points-curve ${
                    isSelected ? "selected" : "not-selected"
                  }`}
                  onClick={() => onCurveClick(start, control, end)}
                />
              );
            }
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
            onClick={() => onCurveClick(start, control, end)}
          />
        );
      })}
    </g>
  );
};
export default ScratchPointCurves;
