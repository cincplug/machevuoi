import { getDistance } from "./index";

export const pinchCanvas = ({
  radius,
  thumbIndexDistance,
  minimum,
  ctx,
  dispersion,
  x,
  y,
  lastX,
  lastY
}) => {
  let targetLineWidth = (radius - thumbIndexDistance) + minimum;
  ctx.lineWidth = (targetLineWidth * 2 - ctx.lineWidth) / 3;
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
