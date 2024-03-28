import { processColor, getAverageDistance } from "./index";

const getLineWidth = ({
  minimum,
  radius,
  growth,
  tipDistance,
  tipIndex,
  dispersion
}) => {
  return Math.max(
    minimum,
    ((radius * growth) / tipDistance) * tipIndex * dispersion
  );
};

export const scratchCanvas = ({
  radius,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  tips,
  scratchPattern,
  lastTips,
  pinchThreshold,
  isSpacePressed,
  dispersion
}) => {
  ctx.strokeStyle = processColor(color, opacity);
  const tipValues = Object.values(tips);
  const tipDistance = getAverageDistance(tipValues);
  if (lastTips && (isSpacePressed || tipDistance < pinchThreshold)) {
    ctx.beginPath();
    if (["quadratics", "charts", "joints"].includes(scratchPattern)) {
      tipValues.forEach((_tip, tipIndex) => {
        ctx.lineWidth = getLineWidth({
          tipIndex,
          minimum,
          radius,
          growth,
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
    } else {
      Object.keys(tips).forEach((tip, tipIndex) => {
        if (!lastTips[tip]) return;
        ctx.moveTo(lastTips[tip].x, lastTips[tip].y);
        ctx.lineWidth = getLineWidth({
          tipIndex,
          minimum,
          radius,
          growth,
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
