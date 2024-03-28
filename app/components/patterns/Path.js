import React, { useEffect } from "react";
import { processColor, renderPath } from "../../utils";

const PATH_SPEED_MODIFIER = 10;
const Path = ({ area, points, className, pathRef, setup, ...commonProps }) => {
  const {
    radius,
    transDur,
    hasCssAnim,
    hasSvgAnim,
    arrangement
  } = setup;

  useEffect(() => {
    if (hasCssAnim && pathRef && pathRef.current) {
      if (area && points && radius) {
        const newPath = renderPath({ area, points, radius });
        pathRef.current.setAttribute("d", newPath);
      }
    }
  }, [area, pathRef, points, radius, hasCssAnim]);

  return (
    <path
      ref={pathRef}
      className={className}
      fill={processColor(setup.color, setup.opacity)}
      d={
        area && points && radius
          ? `${renderPath({ area, points, radius })} Z`
          : ""
      }
      style={
        hasCssAnim
          ? {
              transition: `d ${
                transDur / PATH_SPEED_MODIFIER
              }s ease-out`
            }
          : null
      }
      {...commonProps}
    >
      {arrangement && hasSvgAnim && (
        <animate
          attributeName="d"
          values={`${renderPath({
            area,
            points,
            radius
          })} Z;${renderPath({
            area: [
              ...area.slice(arrangement),
              ...area.slice(0, arrangement)
            ],
            points,
            radius
          })} Z`}
          keyTimes="0;1"
          dur={`${setup.transDur}s`}
          repeatCount="indefinite"
        />
      )}
    </path>
  );
};

export default Path;
