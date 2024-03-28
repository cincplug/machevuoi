import DEFAULT_HAND_POINTS from "../../data/defaultScratchPoints.json";

function ScratchPointSelection({ setup, handleInputChange }) {
  const { scratchPoints } = setup;
  const handlePointClick = (index) => {
    const newScratchPoints = scratchPoints.includes(index)
      ? scratchPoints.filter((point) => point !== index)
      : [...scratchPoints, index];

    handleInputChange({
      target: {
        id: "scratchPoints",
        value: newScratchPoints,
        type: "hidden"
      }
    });
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="hand-selection"
      viewBox="-20 0 480 500"
    >
      {DEFAULT_HAND_POINTS.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={20}
          onClick={() => handlePointClick(index)}
          className={`hand-point ${
            scratchPoints.includes(index) ? "selected" : "not-selected"
          }`}
        >
          {index}
        </circle>
      ))}
    </svg>
  );
}

export default ScratchPointSelection;
