import { processColor, getDistance } from "./index";

export const pinchCanvas = ({
  radius,
  thumbIndexDistance,
  growth,
  minimum,
  ctx,
  color,
  opacity,
  dispersion,
  x,
  y,
  lastX,
  lastY
}) => {
  let targetLineWidth = (radius - thumbIndexDistance) * growth + minimum;
  ctx.lineWidth = (targetLineWidth * 2 - ctx.lineWidth) / 3;
  ctx.strokeStyle = processColor(color, opacity);
  if (!lastX) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.quadraticCurveTo(lastX, lastY, x, y);
    ctx.stroke();
    if (getDistance({ x, y }, { x: lastX, y: lastY }) > dispersion) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }
  lastX = x;
  lastY = y;
  return { lastX, lastY };
};
