import { shapePainters } from "./shapePainters";
import { getDistance } from ".";

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
  activeLayer: string;
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
  lastY,
  activeLayer
}: PinchCanvasParams): void => {
  const targetLineWidth =
    radius -
    (thumbIndexDistance * Math.max(dispersion, 1)) / Math.max(dispersion, 1);
  ctx.lineWidth = Math.max((ctx.lineWidth + targetLineWidth) / 2, minimum);
  const shapePainter = shapePainters[activeLayer];
  if (shapePainter) {
    ctx.beginPath();
    if (!lastX) {
      ctx.moveTo(x, y);
    } else {
      shapePainter({
        ctx,
        start: { x: lastX, y: lastY },
        end: { x, y },
        control: { x: (lastX + x) / 2, y: (lastY + y) / 2 }
      });
    }
  } else {
    if (lastX) {
      ctx.quadraticCurveTo(lastX, lastY, x, y);
      ctx.stroke();
    }
    if (
      getDistance({ x, y }, { x: lastX, y: lastY }) > radius + dispersion - thumbIndexDistance ||
      !lastX
    ) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }
  ctx.stroke();
  lastX = x;
  lastY = y;
};
