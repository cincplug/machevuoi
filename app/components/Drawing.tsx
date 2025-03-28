import React from "react";
import pathStrokes from "./path-strokes";
import { processColor } from "../utils";
import { ISetup, IPoint, ICursor } from "../../types";

interface IProps {
  inputResolution: { width: number; height: number };
  setup: ISetup;
  scribble: IPoint[][];
  scribbleNewArea: IPoint[];
  cursor: ICursor;
}

const Drawing: React.FC<IProps> = ({
  inputResolution,
  setup,
  scribble,
  scribbleNewArea,
  cursor
}) => {
  const { width, height } = inputResolution;
  const { x, y, lastX, lastY } = cursor;
  const { radius, color, opacity, pathStroke, speed, text, fontSize, dash } =
    setup;

  return (
    <svg
      className="svg-drawing"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      style={{ mixBlendMode: setup.blendMode, width, height }}
    >
      {[...scribble, scribbleNewArea].map((scribbleArea, scribbleAreaIndex) => {
        const area = scribbleArea.flat().reverse();
        const pathData =
          area
            .map((point: IPoint, index: number) => {
              const lastPoint = area[area.length - 1] || point;
              const nextPoint = area[Math.min(index + 1, area.length - 1)];
              if (!point || !lastPoint) return null;
              if (radius > 0 && lastPoint && index > 0) {
                const deltaX = point.x - lastPoint.x;
                const deltaY = point.y - lastPoint.y;
                const h = Math.hypot(deltaX, deltaY) + radius;
                const controlPoint = {
                  x: lastPoint.x + deltaX / 2 + deltaY / h,
                  y: lastPoint.y + deltaY / 2 - (radius * deltaX) / h
                };
                return pathStrokes({
                  pathStroke: pathStroke,
                  thisPoint: point,
                  nextPoint,
                  radius
                });
              } else {
                return `${index === 0 ? "M" : "L"} ${point.x},${point.y}`;
              }
            })
            .join(" ") + (setup.isAutoClosed && area.length > 0 ? " Z" : "");
        return (
          <React.Fragment key={`scr-${scribbleAreaIndex}`}>
            <path
              id={`text-path-${scribbleAreaIndex}`}
              className="scribble"
              fill="none"
              stroke={processColor(color, opacity)}
              strokeWidth={radius}
              strokeDasharray={dash}
              d={pathData}
            ></path>
            {text && (
              <text
                fill={processColor(color, opacity)}
                fontSize={fontSize}
                dominantBaseline="text-after-edge"
              >
                <textPath href={`#text-path-${scribbleAreaIndex}`}>
                  {speed > 0 && (
                    <animate
                      attributeName="startOffset"
                      to="0%"
                      from="100%"
                      dur={text.length / speed}
                      repeatCount="indefinite"
                    />
                  )}
                  {text}
                </textPath>
              </text>
            )}
          </React.Fragment>
        );
      })}
      <path
        id={`text-path-cursor`}
        className="scribble"
        fill="none"
        stroke={processColor(color, opacity)}
        strokeWidth={radius}
        strokeDasharray={dash}
        d={`M${lastX || x}, ${lastY || y} L${x}, ${y}`}
      />
    </svg>
  );
};

export default Drawing;
