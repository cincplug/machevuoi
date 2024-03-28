import React from "react";
import Scribble from "./Scribble";

const Drawing = (props) => {
  const { inputResolution, setup, scribble, scribbleNewArea } = props;
  const { width, height } = inputResolution;
  const { radius, growth } = setup;
  return (
    <svg
      className="drawing"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      style={{ mixBlendMode: setup.blendMode, width, height }}
    >
      <Scribble
        scribble={scribble}
        scribbleNewArea={scribbleNewArea}
        setup={setup}
        radius={radius}
        growth={growth}
      />
    </svg>
  );
};

export default Drawing;
