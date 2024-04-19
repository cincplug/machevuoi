import { shapePainters } from "./shapePainters";
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
  ctx.beginPath();
  const shapePainter = shapePainters[activeLayer];
  if (shapePainter) {
    if (!lastX) {
      ctx.moveTo(x, y);
    } else {
      if (dispersion > 0) {
        const distance = getDistance({ x, y }, { x: lastX, y: lastY });
        ctx.lineWidth = Math.max(minimum, radius / distance) + dispersion;
      }
      shapePainter({
        ctx,
        start: { x: lastX, y: lastY },
        end: { x, y },
        control: { x: (lastX + x) / 2, y: (lastY + y) / 2 }
      });
    }
  } else {
    let targetLineWidth = Math.max(minimum, radius / thumbIndexDistance);
    ctx.lineWidth =
      (targetLineWidth * dispersion - ctx.lineWidth) / (dispersion + 1);
    ctx.moveTo(lastX, lastY);
    ctx.quadraticCurveTo(lastX, lastY, x, y);
  }
  ctx.stroke();
  lastX = x;
  lastY = y;
};
