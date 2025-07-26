import { getShapePoints } from "./shapeCalculators";
import { IPoint } from "../../types";
import { isTextSource, stripTextPrefix } from "./index";

interface CanvasContext extends CanvasRenderingContext2D {}

type ShapePainter = (params: {
  ctx: CanvasContext;
  startPoint: IPoint;
  endPoint: IPoint;
  controlPoint?: IPoint;
  isAutoClosed?: boolean;
  url?: string;
  text?: string;
  opacity?: number;
}) => void;

const imageCache: Map<string, HTMLImageElement> = new Map();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(imageCache.get(src)!);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function drawBitmap(
  ctx: CanvasRenderingContext2D,
  startPoint: IPoint,
  endPoint: IPoint,
  url: string,
  opacity: number
): Promise<void> {
  const img = await loadImage(url);
  const height = Math.hypot(
    endPoint.x - startPoint.x,
    endPoint.y - startPoint.y
  );
  const width = (height * img.width) / img.height;

  const originalAlpha = ctx.globalAlpha;
  ctx.save();
  ctx.globalAlpha = opacity / 255;
  ctx.translate(startPoint.x, startPoint.y);
  const angle =
    Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) -
    Math.PI / 2;
  ctx.rotate(angle);
  ctx.drawImage(img, -width / 2, 0, width, height);
  ctx.restore();
  ctx.globalAlpha = originalAlpha;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  startPoint: IPoint,
  endPoint: IPoint,
  text: string,
  opacity: number
): void {
  const height = Math.hypot(
    endPoint.x - startPoint.x,
    endPoint.y - startPoint.y
  );
  
  const originalAlpha = ctx.globalAlpha;
  ctx.save();
  ctx.globalAlpha = opacity / 255;
  ctx.translate(startPoint.x, startPoint.y);
  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) - Math.PI/2;
  ctx.rotate(angle);
  
  ctx.font = `${height}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  ctx.restore();
  ctx.globalAlpha = originalAlpha;
}

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

  text: ({
    ctx,
    startPoint,
    endPoint,
    text = "",
    opacity = 255
  }: {
    ctx: CanvasRenderingContext2D;
    startPoint: IPoint;
    endPoint: IPoint;
    text?: string;
    opacity?: number;
  }): void => {
    if (!text) return;
    const height = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

    const originalAlpha = ctx.globalAlpha;
    ctx.save();
    ctx.globalAlpha = opacity / 255;
    ctx.translate(startPoint.x, startPoint.y);

    let angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    ctx.rotate(angle - Math.PI / 2);

    ctx.font = `${height}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.fillText(stripTextPrefix(text), 0, 0);

    ctx.restore();
    ctx.globalAlpha = originalAlpha;
  },

  bitmaps: async ({
    ctx,
    startPoint,
    endPoint,
    url,
    opacity = 255
  }: {
    ctx: CanvasRenderingContext2D;
    startPoint: IPoint;
    endPoint: IPoint;
    url?: string;
    opacity?: number;
  }): Promise<void> => {
    if (!url) return;
    
    if (isTextSource(url)) {
      drawText(ctx, startPoint, endPoint, url, opacity);
    } else {
      await drawBitmap(ctx, startPoint, endPoint, url, opacity);
    }
  }
};
