import { shapePainters } from "./shapePainters";
import { getLineWidth } from ".";

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
  ctx.lineWidth = getLineWidth(radius, thumbIndexDistance, dispersion, minimum);
  const shapePainter = shapePainters[activeLayer];
  if (shapePainter) {
    ctx.beginPath();
    if (!lastX) {
      ctx.moveTo(x, y);
    } else {
      shapePainter({
        ctx,
        startPoint: { x: lastX, y: lastY },
        endPoint: { x, y },
        controlPoint: { x: (lastX + x) / 2, y: (lastY + y) / 2 }
      });
    }
  } else {
    if (lastX) {
      ctx.quadraticCurveTo(lastX, lastY, x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  ctx.stroke();
  lastX = x;
  lastY = y;
};
