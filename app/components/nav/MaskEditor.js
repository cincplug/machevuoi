import React, { useState } from "react";
import DEFAULT_FACE_POINTS from "../../data/defaultFacePoints.json";
import { renderPath, saveJson } from "../../utils";

function MaskEditor(props) {
  const { inputResolution, setIsEditing, activeMask } = props;
  const [mask, setMask] = useState(activeMask);
  const [maskNewArea, setMaskNewArea] = useState([]);
  const [mouseX, setMouseX] = useState(inputResolution.width / 2);
  const [mouseY, setMouseY] = useState(inputResolution.height / 2);

  const handleDotClick = (_event, pointIndex) => {
    console.info(pointIndex);
    const areaIndex = mask.findIndex((area) => area.includes(pointIndex));
    if (areaIndex !== -1) {
      if (maskNewArea[0] === pointIndex) {
        setMask((prevMask) => {
          const updatedMask = [...prevMask];
          updatedMask[areaIndex] = updatedMask[areaIndex].filter(
            (dot) => dot !== pointIndex
          );
          return updatedMask;
        });
        setMaskNewArea([]);
      } else {
        setMaskNewArea([pointIndex]);
      }
    } else if (maskNewArea.length > 0) {
      const focusedAreaIndex = mask.findIndex((area) =>
        area.includes(maskNewArea[0])
      );
      if (focusedAreaIndex !== -1) {
        setMask((prevMask) => {
          const updatedMask = [...prevMask];
          const dotIndex = updatedMask[focusedAreaIndex].indexOf(
            maskNewArea[0]
          );
          updatedMask[focusedAreaIndex][dotIndex] = pointIndex;
          return updatedMask;
        });
        setMaskNewArea([]);
      } else if (maskNewArea[0] === pointIndex) {
        setMask((prevMask) => [...prevMask, maskNewArea]);
        setMaskNewArea([]);
      } else if (maskNewArea.includes(pointIndex)) {
        setMaskNewArea((prevMaskNewArea) =>
          prevMaskNewArea.filter((dot) => dot !== pointIndex)
        );
      } else {
        setMaskNewArea((prevMaskNewArea) => [...prevMaskNewArea, pointIndex]);
      }
    } else {
      setMaskNewArea([pointIndex]);
    }
  };

  const handleMouseMove = (event) => {
    if (!event.pageX) return;
    setMouseX(event.pageX || event.touches[0].pageX);
    setMouseY(event.pageY || event.touches[0].pageY);
  };

  return (
    <div className="mask-editor" onMouseMove={handleMouseMove}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${inputResolution.width} ${inputResolution.height}`}
      >
        {mask.map((area, areaIndex) => (
          <path
            key={`a-${areaIndex}`}
            className="mask-editor__area"
            d={`${renderPath({ area, points: DEFAULT_FACE_POINTS })} Z`}
          />
        ))}
        {maskNewArea.length > 0 ? (
          <path
            className="mask-editor__new-area"
            d={`${renderPath({
              area: maskNewArea,
              points: DEFAULT_FACE_POINTS
            })} L${mouseX},${mouseY}`}
          />
        ) : null}
        {DEFAULT_FACE_POINTS.map((point, pointIndex) => {
          return (
            <circle
              key={`c-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={4}
              className={`mask-editor__dot ${
                maskNewArea[0] === pointIndex ? "mask-editor__dot--first" : ""
              }`}
              onClick={(event) => handleDotClick(event, pointIndex)}
            />
          );
        })}
      </svg>
      <nav className="menu menu--controls">
        <button
          className="control control--button"
          onClick={() => saveJson(mask)}
          title="Save to database or at least copy to clipboard"
        >
          Save mask
        </button>
        <button
          className="control control--button"
          onClick={() => setIsEditing(false)}
          title="Close without saving"
        >
          Close
        </button>
        <p>Click on dots to add / remove points from custom masks</p>
      </nav>
    </div>
  );
}

export default MaskEditor;
