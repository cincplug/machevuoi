import React from "react";
import { processColor } from "../../utils";

const Kite = ({ scribble, scribbleNewArea, setup }) => {
  const { radius, text, color, opacity, speed, fontSize, dash } = setup;

  const textArray = Array.from(text);
  const area = [...scribble, scribbleNewArea].flat();

  const pathData = area.length
    ? area
        .map((point, index) => {
          return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
        })
        .join(" ")
    : null;

  return (
    <svg>
      <path
        id="text-path"
        d={pathData}
        fill="none"
        stroke={processColor(color, opacity)}
        strokeWidth={radius}
        strokeDasharray={dash}
      />
      {textArray.map((letter, index) => {
        const style = {
          animation: `move-to ${textArray.length / speed}s linear infinite`
        };
        const endOffset = (index / textArray.length) * 100;
        return (
          <text
            fill={processColor(color, opacity)}
            key={`sent-${index}`}
            fontSize={fontSize + textArray.length - index}
            style={style}
          >
            <textPath href="#text-path" startOffset={`${endOffset}%`}>
              <animate
                attributeName="startOffset"
                from={`${endOffset}%`}
                to={`${endOffset + radius}%`}
                dur={10 / speed}
                repeatCount="indefinite"
              />
              {letter}
            </textPath>
          </text>
        );
      })}
    </svg>
  );
};

export default Kite;
