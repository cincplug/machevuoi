import { IPoint } from "../../types";
import { getShapePoints } from "./shapeCalculators";

interface CanvasContext extends CanvasRenderingContext2D {}

type ShapePainter = (params: {
  ctx: CanvasContext;
  start: IPoint;
  end: IPoint;
  control?: IPoint;
}) => void;

export const shapePainters: Record<string, ShapePainter> = {
  lines: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, epx, epy } = getShapePoints({
      shape: "lines",
      start,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(epx, epy);
  },

  curves: ({
    ctx,
    start,
    control,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    control?: IPoint;
    end: IPoint;
  }): void => {
    const { cpx, cpy } = getShapePoints({
      shape: "curves",
      start,
      control,
      end
    });
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(cpx, cpy, end.x, end.y);
  },

  arcs: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { cpx, cpy } = getShapePoints({
      shape: "arcs",
      start,
      end
    });
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(cpx, cpy, end.x, end.y);
  },

  ellipses: ({
    ctx,
    start,
    control,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    control?: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, rx, ry, rotation } = getShapePoints({
      shape: "ellipses",
      start,
      control,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.ellipse(start.x, start.y, rx, ry, rotation, 0, 2 * Math.PI);
  },

  diamonds: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, apx, apy } = getShapePoints({
      shape: "diamonds",
      start,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(epx, epy);
    ctx.lineTo(apx, apy);
    ctx.closePath();
  },

  squares: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, dpx, dpy } = getShapePoints({
      shape: "squares",
      start,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(dpx, dpy);
    ctx.lineTo(epx, epy);
    ctx.closePath();
  },

  rhomboids: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, dpx, dpy } = getShapePoints({
      shape: "rhomboids",
      start,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(epx, epy);
    ctx.lineTo(dpx, dpy);
    ctx.closePath();
  },

  circles: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { mpx, mpy, circleRadius } = getShapePoints({
      shape: "circles",
      start,
      end
    });
    ctx.moveTo(mpx + circleRadius, mpy);
    ctx.arc(mpx, mpy, circleRadius, 0, 2 * Math.PI);
  },

  rectangles: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, epx, epy, cpx, cpy, dpx, dpy } = getShapePoints({
      shape: "rectangles",
      start,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(cpx, cpy);
    ctx.lineTo(epx, epy);
    ctx.lineTo(dpx, dpy);
    ctx.closePath();
  },

  triangles: ({
    ctx,
    start,
    end
  }: {
    ctx: CanvasContext;
    start: IPoint;
    end: IPoint;
  }): void => {
    const { spx, spy, epx, epy, tpx, tpy } = getShapePoints({
      shape: "triangles",
      start,
      end
    });
    ctx.moveTo(spx, spy);
    ctx.lineTo(tpx, tpy);
    ctx.lineTo(epx, epy);
    ctx.closePath();
  }
};
