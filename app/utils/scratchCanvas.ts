import { IPoint, IShape, IShapes } from "../../types";
import { getAverageDistance, getLineWidth } from ".";
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
  ctx.lineWidth = getLineWidth(
    radius + Object.keys(shapes).length,
    shapeTipDistance,
    dispersion,
    minimum
  );
  Object.keys(shapes).forEach((shapeName) => {
    const shapeList = shapes[shapeName as keyof IShapes];
    shapeList.forEach((shape: IShape) => {
      const painter = shapePainters[shapeName];
      if (painter) {
        painter({
          ctx,
          start: shape.startPoint,
          end: shape.endPoint,
          control: shape.controlPoint
        });
      }
    });
  });
  ctx.stroke();
  if (tips) {
    ctx.beginPath();
    const tipDistance = getAverageDistance(tips);
    if (!shapeTipDistance) {
      ctx.lineWidth = getLineWidth(
        radius + tips.length,
        tipDistance,
        dispersion,
        minimum
      );
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
