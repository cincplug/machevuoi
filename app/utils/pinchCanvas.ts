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
  let targetLineWidth = radius - thumbIndexDistance + minimum;
  ctx.lineWidth = (targetLineWidth * 2 - ctx.lineWidth) / 3;

  const shapePainter = shapePainters[activeLayer];

  if (shapePainter) {
    ctx.beginPath();
    if (!lastX) {
      ctx.moveTo(x, y);
    } else {
      if (activeLayer === "dots") {
        ctx.moveTo(lastX, lastY);
        ctx.quadraticCurveTo(lastX, lastY, x, y);
      }
      const distance = getDistance({ x, y }, { x: lastX, y: lastY });

      if (distance > dispersion) {
        shapePainter({ ctx, start: { x: lastX, y: lastY }, end: { x, y }, control: {x: (lastX + x) / 2, y: (lastY + y) / 2} });
      }
    }
  }
  ctx.stroke();
  lastX = x;
  lastY = y;
};
