import { processColor, getAverageDistance } from "./index";

const getLineWidth = ({
  minimum,
  radius,
  tipDistance,
  index = 5,
}) => {
  return Math.max(
    minimum,
    (radius / tipDistance) * index
  );
};

export const scratchCanvas = ({
  radius,
  minimum,
  ctx,
  color,
  opacity,
  tips,
  scratchPattern,
  lastTips,
  pinchThreshold,
  pressedKey,
  dispersion,
  lines,
  curves
}) => {
  const tipValues = Object.values(tips);
  const tipDistance = getAverageDistance(tipValues);
  ctx.strokeStyle = processColor(color, opacity);
  if (lastTips && (pressedKey === "Shift" || tipDistance < pinchThreshold)) {
    ctx.beginPath();
    if (scratchPattern === "custom") {
      if (lines.length > 0) {
        lines.forEach(({ start, end }, index) => {
          ctx.lineWidth = getLineWidth({
            minimum,
            radius,
            tipDistance,
            index,
            dispersion
          });
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
        });
      }
      if (curves.length > 0) {
        curves.forEach(({ start, control, end }) => {
          ctx.moveTo(start.x, start.y);
          ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
        });
      }
      ctx.stroke();
    } else if (["quadratics", "charts", "joints"].includes(scratchPattern)) {
      tipValues.forEach((_tip, tipIndex) => {
        ctx.lineWidth = getLineWidth({
          tipIndex,
          minimum,
          radius,
          tipDistance,
          dispersion
        });
        const prevIndex = tipIndex === 0 ? tipValues.length - 1 : tipIndex - 1;
        if (scratchPattern === "quadratics") {
          ctx.quadraticCurveTo(
            tipValues[tipIndex].x,
            tipValues[tipIndex].y,
            tipValues[prevIndex].x,
            tipValues[prevIndex].y
          );
        } else if (scratchPattern === "charts") {
          ctx.rect(
            tipValues[tipIndex].x,
            tipValues[tipIndex].y,
            tipValues[prevIndex].x - tipValues[tipIndex].x,
            tipValues[prevIndex].y - tipValues[tipIndex].y
          );
        } else if (scratchPattern === "joints") {
          ctx.arc(
            tipValues[tipIndex].x,
            tipValues[tipIndex].y,
            radius,
            (2 * Math.PI) / tipValues[tipIndex].y,
            Math.abs(tips[tipIndex].x - tipValues[prevIndex].x)
          );
        }
        ctx.stroke();
      });
    } else if (["lines", "rectangles"].includes(scratchPattern)) {
      Object.keys(tips).forEach((tip, index) => {
        if (!lastTips[tip]) return;
        ctx.moveTo(lastTips[tip].x, lastTips[tip].y);
        ctx.lineWidth = getLineWidth({
          index,
          minimum,
          radius,
          tipDistance,
          dispersion
        });
        if (scratchPattern === "lines") {
          ctx.quadraticCurveTo(
            lastTips[tip].x,
            lastTips[tip].y,
            tips[tip].x,
            tips[tip].y
          );
        }
        if (scratchPattern === "rectangles") {
          ctx.rect(
            lastTips[tip].x,
            lastTips[tip].y,
            tips[tip].x - lastTips[tip].x,
            tips[tip].y - lastTips[tip].y
          );
        }
        ctx.stroke();
      });
    }
  }
  lastTips = { ...tips };
  return lastTips;
};
