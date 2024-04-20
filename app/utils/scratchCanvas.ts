import { IPoint, IShape, IShapes } from "../../types";
import { getAverageDistance } from "./index";
import { shapePainters } from "./shapePainters";

type Tips = IPoint[];
interface ScratchCanvasOptions {
  radius: number;
  minimum: number;
  ctx: CanvasRenderingContext2D;
  tips: Tips;
  lastTips: Tips | null;
  dispersion: number;
  shapes: IShapes;
  handIndex: number;
}

const MIN_DISTANCE_FACTOR = 0.5;
const MAX_DISTANCE_FACTOR = 1.5;
const BASE_DISTANCE = 100;

export function calculateLineWidth(
  distance: number,
  radius: number,
  dispersion: number
): number {
  const minLineWidth = MIN_DISTANCE_FACTOR * radius;
  const maxLineWidth = MAX_DISTANCE_FACTOR * radius;
  const normalizedDistance = Math.max(
    MIN_DISTANCE_FACTOR * BASE_DISTANCE,
    Math.min(MAX_DISTANCE_FACTOR * BASE_DISTANCE, distance)
  );
  const proportion =
    (normalizedDistance - MIN_DISTANCE_FACTOR * BASE_DISTANCE) /
    (MAX_DISTANCE_FACTOR * BASE_DISTANCE - MIN_DISTANCE_FACTOR * BASE_DISTANCE);
  const adjustedProportion = proportion * (dispersion / 50);
  const lineWidth =
    minLineWidth + (maxLineWidth - minLineWidth) * adjustedProportion;
  return lineWidth;
}

export const scratchCanvas = ({
  radius,
  minimum,
  ctx,
  tips,
  lastTips,
  dispersion,
  shapes,
  handIndex
}: ScratchCanvasOptions): void => {
  ctx.beginPath();
  const shapeTipDistance = getAverageDistance(
    Object.values(shapes)
      .flat()
      .map((shape) => shape.start)
  );
  ctx.lineWidth = calculateLineWidth(shapeTipDistance, radius, dispersion);
  Object.keys(shapes).forEach((shapeName) => {
    const shapeList = shapes[shapeName as keyof IShapes];
    shapeList.forEach((shape: IShape) => {
      const painter = shapePainters[shapeName];
      if (painter) {
        painter({ ctx, ...shape });
      }
    });
  });
  ctx.stroke();
  if (tips) {
    ctx.beginPath();
    const tipDistance = getAverageDistance(tips);
    if (!shapeTipDistance) {
      ctx.lineWidth = calculateLineWidth(tipDistance, radius, dispersion);
    }
    tips.forEach((tip, index) => {
      if (!lastTips || !lastTips[index]) return;
      const { x: tipX, y: tipY } = tip;
      const { x: lastTipX, y: lastTipY } = lastTips[index];

      if (handIndex % 2 === 0) {
        ctx.moveTo(lastTipX, lastTipY);
        ctx.quadraticCurveTo(lastTipX, lastTipY, tipX, tipY);
      }
    });
    ctx.stroke();
  }
};
