import { getAverageDistance } from "./index";

const getLineWidth = ({ minimum, radius, tipDistance, index = 5 }) => {
  return Math.max(minimum, (radius / tipDistance));
};

export const scratchCanvas = ({
  radius,
  minimum,
  ctx,
  tips,
  lastTips,
  dispersion,
  lines,
  curves,
  arcs
}) => {
  ctx.beginPath();
  if (lines.length > 0) {
    lines.forEach(({ start, end }, index) => {
      ctx.lineWidth = getLineWidth({
        minimum,
        radius,
        tipDistance: radius,
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
  if (arcs.length > 0) {
    arcs.forEach(({ start, control, end }) => {
      const centerX = control.x;
      const centerY = control.y;
      const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) / 2;
      const startAngle = Math.atan2(start.y - centerY, start.x - centerX);
      const endAngle = Math.atan2(end.y - centerY, end.x - centerX);
  
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    });
  }  
  ctx.stroke();
  if (tips) {
    const tipValues = Object.values(tips);
    const tipDistance = getAverageDistance(tipValues);
    tipValues.forEach((_tip, tipIndex) => {
      ctx.lineWidth = getLineWidth({
        tipIndex,
        minimum,
        radius,
        tipDistance,
        dispersion
      });
      const prevIndex = tipIndex === 0 ? tipValues.length - 1 : tipIndex - 1;
      // ctx.rect(
      //   tipValues[tipIndex].x,
      //   tipValues[tipIndex].y,
      //   tipValues[prevIndex].x - tipValues[tipIndex].x,
      //   tipValues[prevIndex].y - tipValues[tipIndex].y
      // );
      // ctx.arc(
      //   tipValues[tipIndex].x,
      //   tipValues[tipIndex].y,
      //   tipDistance / radius,
      //   tipValues[tipIndex].y,
      //   Math.abs(tips[tipIndex].x - tipValues[prevIndex].x)
      // );
      ctx.stroke();
    });

    Object.keys(tips).forEach((tip, index) => {
      if (!lastTips || !lastTips[tip]) return;
      ctx.moveTo(lastTips[tip].x, lastTips[tip].y);
      ctx.lineWidth = getLineWidth({
        index,
        minimum,
        radius,
        tipDistance,
        dispersion
      });
      ctx.quadraticCurveTo(
        lastTips[tip].x,
        lastTips[tip].y,
        tips[tip].x,
        tips[tip].y
      );
      ctx.stroke();
    });
  }
  lastTips = { ...tips } || null;
  return lastTips;
};
