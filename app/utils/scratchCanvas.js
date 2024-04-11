import { getAverageDistance } from "./index";

const getLineWidth = ({ minimum, radius, tipDistance }) => {
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
  arcs,
  ovals,
  circles
}) => {
  ctx.lineWidth = getLineWidth({
    minimum,
    radius,
    tipDistance: radius
  });
  ctx.beginPath();
  if (lines.length > 0) {
    lines.forEach(({ start, end }) => {
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
    arcs.forEach(({ start, end }) => {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const slope = -(start.x - end.x) / (start.y - end.y);
      const distance =
        Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2) / 2;
      const controlX = midX + distance / Math.sqrt(1 + slope ** 2);
      const controlY = midY + slope * (controlX - midX);
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
    });
  }

  if (ovals.length > 0) {
    ovals.forEach(({ start, control, end }) => {
      const distControl = Math.sqrt(
        (control.x - start.x) ** 2 + (control.y - start.y) ** 2
      );
      const distEnd = Math.sqrt(
        (end.x - start.x) ** 2 + (end.y - start.y) ** 2
      );
      const rx = Math.max(distControl, distEnd);
      const ry = Math.min(distControl, distEnd);
      const rotation =
        distControl > distEnd
          ? Math.atan2(control.y - start.y, control.x - start.x)
          : Math.atan2(end.y - start.y, end.x - start.x);

      const startX = start.x + rx * Math.cos(rotation);
      const startY = start.y + rx * Math.sin(rotation);

      ctx.moveTo(startX, startY);
      ctx.ellipse(start.x, start.y, rx, ry, rotation, 0, 2 * Math.PI);
    });
  }

  if (circles.length > 0) {
    circles.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const midx = (spx + epx) / 2;
      const midy = (spy + epy) / 2;

      const circleRadius = Math.sqrt((midx - spx) ** 2 + (midy - spy) ** 2);

      ctx.arc(midx, midy, circleRadius, 0, 2 * Math.PI);
    });
  }

  ctx.stroke();
  ctx.beginPath();

  if (tips) {
    const tipValues = Object.values(tips);
    const tipDistance = getAverageDistance(tipValues);
    Object.keys(tips).forEach((tip, index) => {
      if (!lastTips || !lastTips[tip]) return;
      ctx.moveTo(lastTips[tip].x, lastTips[tip].y);
      ctx.lineWidth = getLineWidth({
        minimum,
        radius: radius * index + dispersion,
        tipDistance
      });
      ctx.quadraticCurveTo(
        lastTips[tip].x,
        lastTips[tip].y,
        tips[tip].x,
        tips[tip].y
      );
    });
  }
  ctx.stroke();
  lastTips = { ...tips } || null;
  return lastTips;
};
