import React, { useRef } from "react";
import Path from "./Path";

const Paths = ({ points, activeMask, setup, customMask, customMaskNewArea }) => {
  const { arrangement } = setup;
  const maskRefs = useRef(activeMask.map(() => React.createRef()));
  const customFaceAreaRefs = useRef(customMask.map(() => React.createRef()));
  const customMaskNewAreaRef = useRef(null);
  const commonProps = {
    setup,
    points
  };

  return (
    <>
      {activeMask.map((area, areaIndex) => (
        <Path
          key={`m-${areaIndex}`}
          area={[
            ...area.slice(arrangement),
            ...area.slice(0, arrangement)
          ]}
          className="mask-path mask-path--default"
          pathRef={maskRefs.current[areaIndex]}
          {...commonProps}
        />
      ))}
      {customMask &&
        customMask.map((customFaceArea, customFaceAreaIndex) => (
          <Path
            key={`ch-${customFaceAreaIndex}`}
            area={customFaceArea}
            className="mask-path mask-path--custom-face-area"
            pathRef={customFaceAreaRefs.current[customFaceAreaIndex]}
            {...commonProps}
          />
        ))}
      {customMaskNewArea && (
        <Path
          area={customMaskNewArea}
          className="mask-path mask-path--custom-face-area mask-path--custom-face-area--active"
          pathRef={customMaskNewAreaRef}
          {...commonProps}
        />
      )}
    </>
  );
};

export default Paths;
