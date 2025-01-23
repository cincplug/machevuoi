import { getShapePoints } from "./shapeCalculators";
import { IPoint } from "../../types";

interface CanvasContext extends CanvasRenderingContext2D {}

type ShapePainter = (params: {
  ctx: CanvasContext;
  startPoint: IPoint;
  endPoint: IPoint;
  controlPoint?: IPoint;
  isAutoClosed?: boolean;
}) => void;

let cachedImage: HTMLImageElement | null = null;

export const shapePainters: Record<string, ShapePainter> = {
  lines: ({
    ctx,
    startPoint,
    endPoint
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
  }): void => {
    const { spx, spy, epx, epy } = getShapePoints({
      shape: "lines",
      startPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(epx, epy);
  },

  curves: ({
    ctx,
    startPoint,
    controlPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    controlPoint?: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { cpx, cpy } = getShapePoints({
      shape: "curves",
      startPoint,
      controlPoint,
      endPoint
    });
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(cpx, cpy, endPoint.x, endPoint.y);
    if (isAutoClosed) ctx.closePath();
  },

  arcs: ({
    ctx,
    startPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { cpx, cpy } = getShapePoints({
      shape: "arcs",
      startPoint,
      endPoint
    });
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.quadraticCurveTo(cpx, cpy, endPoint.x, endPoint.y);
    if (isAutoClosed) ctx.closePath();
  },

  ellipses: ({
    ctx,
    startPoint,
    controlPoint,
    endPoint
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    controlPoint?: IPoint;
    endPoint: IPoint;
  }): void => {
    const { spx, spy, rx, ry, rotation } = getShapePoints({
      shape: "ellipses",
      startPoint,
      controlPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.ellipse(startPoint.x, startPoint.y, rx, ry, rotation, 0, 2 * Math.PI);
  },

  diamonds: ({
    ctx,
    startPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, apx, apy } = getShapePoints({
      shape: "diamonds",
      startPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(epx, epy);
    ctx.lineTo(apx, apy);
    if (isAutoClosed) ctx.closePath();
  },

  squares: ({
    ctx,
    startPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, dpx, dpy } = getShapePoints({
      shape: "squares",
      startPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(dpx, dpy);
    ctx.lineTo(epx, epy);
    if (isAutoClosed) ctx.closePath();
  },

  rhomboids: ({
    ctx,
    startPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, dpx, dpy } = getShapePoints({
      shape: "rhomboids",
      startPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(epx, epy);
    ctx.lineTo(dpx, dpy);
    if (isAutoClosed) ctx.closePath();
  },

  circles: ({
    ctx,
    startPoint,
    endPoint
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
  }): void => {
    const { mpx, mpy, circleRadius } = getShapePoints({
      shape: "circles",
      startPoint,
      endPoint
    });
    ctx.moveTo(mpx + circleRadius, mpy);
    ctx.arc(mpx, mpy, circleRadius, 0, 2 * Math.PI);
  },

  rectangles: ({
    ctx,
    startPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, dpx, dpy } = getShapePoints({
      shape: "rectangles",
      startPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(epx, epy);
    ctx.lineTo(dpx, dpy);
    if (isAutoClosed) ctx.closePath();
  },

  triangles: ({
    ctx,
    startPoint,
    endPoint,
    isAutoClosed
  }: {
    ctx: CanvasContext;
    startPoint: IPoint;
    endPoint: IPoint;
    isAutoClosed?: boolean;
  }): void => {
    const { spx, spy, epx, epy, tpx, tpy } = getShapePoints({
      shape: "triangles",
      startPoint,
      endPoint
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(tpx, tpy);
    ctx.lineTo(epx, epy);
    if (isAutoClosed) ctx.closePath();
  },

  bitmaps: ({
    ctx,
    startPoint,
    endPoint
  }: {
    ctx: CanvasRenderingContext2D;
    startPoint: IPoint;
    endPoint: IPoint;
  }): void => {
    if (!cachedImage) {
      cachedImage = new Image();
      cachedImage.src = "/image.png";
    }

    if (!cachedImage.complete) {
      cachedImage.onload = () => drawScaledImage();
      return;
    }

    function drawScaledImage() {
      const height = Math.hypot(
        endPoint.x - startPoint.x,
        endPoint.y - startPoint.y
      );
      const width = (height * cachedImage!.width) / cachedImage!.height;

      ctx.save();
      ctx.translate(startPoint.x, startPoint.y);

      const angle =
        Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) -
        Math.PI / 2;

      ctx.rotate(angle);
      ctx.drawImage(cachedImage!, -width / 2, 0, width, height);
      ctx.restore();
    }

    drawScaledImage();
  }
};
