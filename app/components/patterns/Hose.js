import React from "react";
import { processColor } from "../../utils";

const Hose = ({ scribble, scribbleNewArea, setup, radius, growth }) => {
  const {
    text,
    color,
    opacity,
    hasCssAnim,
    transDur
  } = setup;

  const textArray = Array.from(text);
  const area = [...scribble, scribbleNewArea]
    .flat();

  let shiftedTextArray = textArray;
  if (area.length >= textArray.length) {
    shiftedTextArray = textArray
      .slice(area.length % textArray.length)
      .concat(textArray.slice(0, area.length % textArray.length));
  }

  return area.map((point, index) => {
    const style = hasCssAnim
      ? {
          animation: `move-to ${transDur}s linear infinite`,
          animationDelay: `${-index * transDur}s`,
          "--dx": `${area[Math.max(0, index - 1)].x - point.x}px`,
          "--dy": `${area[Math.max(0, index - 1)].y - point.y}px`
        }
      : null;
    const letter = shiftedTextArray[index];
    return (
      <text
        className={`number-mask`}
        fill={processColor(color, opacity)}
        key={`sent-${index}`}
        x={point.x}
        y={point.y}
        style={style}
        fontSize={radius + index * growth}
      >
        {letter}
      </text>
    );
  });
};

export default Hose;
