import { getExtendedHandPoints } from "../../utils";

interface DotsProps {
  selectedDots: number[];
  dotTooltip: string;
  handleDotClick: (index: number) => void;
}

const extendedHandPoints = getExtendedHandPoints();

const Dots: React.FC<DotsProps> = ({
  selectedDots,
  dotTooltip,
  handleDotClick
}) => {
  return extendedHandPoints.map((point, index) => {
    const isSelected = selectedDots && selectedDots.includes(index);
    const title =
      dotTooltip ||
      `Dot ${index} is ${isSelected ? "on" : "off"}. Click to turn it ${
        isSelected ? "off" : "on"
      }`;
    return (
      <circle
        key={index}
        cx={point.x}
        cy={point.y}
        r={index <= 20 ? 10 : 7}
        onClick={() => handleDotClick(index)}
        className={`scratch-dot ${isSelected ? "selected" : "not-selected"}`}
      >
        <title>{title}</title>
      </circle>
    );
  });
};

export default Dots;
