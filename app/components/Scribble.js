import React from "react";
import pathStrokes from "./patterns/path-strokes";
import { processColor } from "../utils";
import Hose from "./patterns/Hose";
import Kite from "./patterns/Kite";

const Scribble = ({ scribble, scribbleNewArea, setup }) => {
  const {
    pattern,
    color,
    opacity,
    pathStroke,
    arrangement,
    transDur,
    text,
    radius,
    growth,
    minimum
  } = setup;

  if (pattern === "hose") {
    return (
      <Hose
        scribble={scribble}
        scribbleNewArea={scribbleNewArea}
        setup={setup}
        radius={radius}
        growth={growth}
      />
    );
  }
  if (pattern === "kite") {
    return (
      <Kite
        scribble={scribble}
        scribbleNewArea={scribbleNewArea}
        setup={setup}
        radius={radius}
        growth={growth}
      />
    );
  }
  return (
    <>
      {[...scribble, scribbleNewArea].map((scribbleArea, scribbleAreaIndex) => {
        const area = scribbleArea.flat().reverse();
        const pathData =
          area
            .map((point, index) => {
              const lastPoint = area[area.length - 1] || point;
              const prevPoint = area[Math.max(0, index - 1)] || point;
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
                  prevPoint,
                  nextPoint,
                  controlPoint,
                  radius,
                  growth
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
              strokeWidth={radius * growth}
              d={pathData}
            ></path>
            {text && (
              <text
                className={`number-mask`}
                fill={processColor(color, opacity)}
                fontSize={radius * minimum + scribbleAreaIndex}
                dominantBaseline="text-after-edge"
              >
                <textPath href={`#text-path-${scribbleAreaIndex}`}>
                  {arrangement > 0 && (
                    <animate
                      attributeName="startOffset"
                      to={`${arrangement}%`}
                      from={`${100 - arrangement}%`}
                      dur={transDur * 10}
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
    </>
  );
};

export default Scribble;
