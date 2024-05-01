import { getExtendedHandPoints } from "../../utils";

interface DotsProps {
  selectedDots: number[];
  handleDotClick: (index: number) => void;
}

const extendedHandPoints = getExtendedHandPoints();

const Dots: React.FC<DotsProps> = ({ selectedDots, handleDotClick }) => {
  return extendedHandPoints.map((point, index) => (
    <circle
      key={index}
      cx={point.x}
      cy={point.y}
      r={index <= 20 ? 10 : 7}
      onClick={() => handleDotClick(index)}
      className={`scratch-dot ${
        selectedDots && selectedDots.includes(index) ? "selected" : "not-selected"
      }`}
    >
      <title>{index}</title>
    </circle>
  ));
}

export default Dots;
