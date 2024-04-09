import { getAverageDistance } from "./index";

const getLineWidth = ({ minimum, radius, tipDistance, index = 5 }) => {
  return Math.max(minimum, radius / tipDistance);
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
      const cp1x = start.x + (control.x - start.x) / 2;
      const cp1y = start.y + (control.y - start.y) / 2;
      const cp2x = control.x + (end.x - control.x) / 2;
      const cp2y = control.y + (end.y - control.y) / 2;
      ctx.moveTo(start.x, start.y);    
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y);
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
