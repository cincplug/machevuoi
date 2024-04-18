import { getDistance } from "./index";

interface PinchCanvasParams {
  radius: number;
  thumbIndexDistance: number;
  minimum: number;
  ctx: CanvasRenderingContext2D;
  dispersion: number;
  x: number;
  y: number;
  lastX: number;
  lastY: number;
}

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
}: PinchCanvasParams): void => {
  let targetLineWidth = radius - thumbIndexDistance + minimum;
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
};
