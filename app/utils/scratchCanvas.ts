import {
  getAverageDistance,
  getLineWidth,
  applyPaint,
  isBitmapSource
} from ".";
import { shapePainters } from "./shapePainters";
import { IPoint, IShape, IShapes } from "../../types";

type Tips = IPoint[];
interface ScratchCanvasOptions {
  radius: number;
  minimum: number;
  ctx: CanvasRenderingContext2D;
  tips: Tips;
  lastTips: Tips | null;
  dynamics: number;
  shapes: IShapes;
  handIndex: number;
  isAutoClosed: boolean;
  isFill: boolean;
  opacity: number;
}

export const scratchCanvas = ({
  radius,
  minimum,
  ctx,
  tips,
  lastTips,
  dynamics,
  shapes,
  handIndex,
  isAutoClosed,
  isFill,
  opacity
}: ScratchCanvasOptions): void => {
  ctx.beginPath();
  const shapeTipDistance = getAverageDistance(
    Object.values(shapes)
      .flat()
      .map((shape) => shape.startPoint)
  );
  ctx.lineWidth = getLineWidth(
    radius + Object.keys(shapes).length,
    shapeTipDistance,
    dynamics,
    minimum
  );
  Object.keys(shapes).forEach((shapeName) => {
    const shapeList = shapes[shapeName as keyof IShapes];
    // Extract base type and text content if present
    const [baseType, textContent] = shapeName.split(":");
    shapeList.forEach((shape: IShape) => {
      const shapePainter = shapePainters[baseType] || shapePainters.bitmaps;
      const painterParams: any = {
        ctx,
        startPoint: shape.startPoint,
        endPoint: shape.endPoint,
        controlPoint: shape.controlPoint,
        isAutoClosed,
        opacity
      };
      if (baseType === "text") {
        painterParams.text = textContent || (shape as any).text;
      } else if (baseType === "bitmaps") {
        painterParams.url = (shape as any).url;
      }
      if (shapePainter) {
        shapePainter(painterParams);
      }
    });
  });

  applyPaint({ isFill, ctx });

  if (tips) {
    ctx.beginPath();
    const tipDistance = getAverageDistance(tips);
    if (!shapeTipDistance) {
      ctx.lineWidth = getLineWidth(
        radius + tips.length,
        tipDistance,
        dynamics,
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
    applyPaint({ isFill, ctx });
  }
};
