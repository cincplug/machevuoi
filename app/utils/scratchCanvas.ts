import { getAverageDistance } from "./index";
import { getShapePoints } from "./getShapePoints";

interface Point {
  x: number;
  y: number;
}

interface Shape {
  start: Point;
  control?: Point;
  end: Point;
}

type Tips = Point[];

interface Shapes {
  lines: Shape[];
  curves: Shape[];
  arcs: Shape[];
  ellipses: Shape[];
  circles: Shape[];
  squares: Shape[];
  rhomboids: Shape[];
  rectangles: Shape[];
  triangles: Shape[];
  diamonds: Shape[];
}

interface ScratchCanvasOptions {
  radius: number;
  minimum: number;
  ctx: CanvasRenderingContext2D;
  tips: Tips;
  lastTips: Tips | null;
  dispersion: number;
  shapes: Shapes;
}

const getLineWidth = ({
  minimum,
  radius,
  tipDistance
}: {
  minimum: number;
  radius: number;
  tipDistance: number;
}): number => {
  return Math.max(minimum, radius / tipDistance);
};

export const scratchCanvas = ({
  radius,
  minimum,
  ctx,
  tips,
  lastTips,
  dispersion,
  shapes
}: ScratchCanvasOptions): Tips | null => {
  const {
    lines,
    curves,
    arcs,
    ellipses,
    circles,
    squares,
    rhomboids,
    rectangles,
    triangles,
    diamonds
  } = shapes;
  ctx.lineWidth = getLineWidth({
    minimum,
    radius,
    tipDistance: radius
  });
  ctx.beginPath();
  if (lines.length > 0) {
    lines.forEach(({ start, end }) => {
      const { spx, spy, epx, epy } = getShapePoints({
        shape: "lines",
        start,
        end
      });
      ctx.moveTo(spx, spy);
      ctx.lineTo(epx, epy);
    });
  }

  if (curves.length > 0) {
    curves.forEach(({ start, control, end }) => {
      const { cpx, cpy } = getShapePoints({
        shape: "curves",
        start,
        control,
        end
      });
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cpx, cpy, end.x, end.y);
    });
  }

  if (arcs.length > 0) {
    arcs.forEach(({ start, end }) => {
      const { cpx, cpy } = getShapePoints({
        shape: "arcs",
        start,
        end
      });
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(cpx, cpy, end.x, end.y);
    });
  }

  if (ellipses.length > 0) {
    ellipses.forEach(({ start, control, end }) => {
      const { spx, spy, rx, ry, rotation } = getShapePoints({
        shape: "ellipses",
        start,
        control,
        end
      });
      ctx.moveTo(spx, spy);
      ctx.ellipse(start.x, start.y, rx, ry, rotation, 0, 2 * Math.PI);
    });
  }

  if (diamonds.length > 0) {
    diamonds.forEach(({ start, end }) => {
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
    });
  }

  if (squares.length > 0) {
    squares.forEach(({ start, end }) => {
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
    });
  }

  if (rhomboids.length > 0) {
    rhomboids.forEach(({ start, end }) => {
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
    });
  }

  if (circles.length > 0) {
    circles.forEach(({ start, end }) => {
      const { mpx, mpy, circleRadius } = getShapePoints({
        shape: "circles",
        start,
        end
      });
      ctx.moveTo(mpx + circleRadius, mpy);
      ctx.arc(mpx, mpy, circleRadius, 0, 2 * Math.PI);
    });
  }

  if (rectangles.length > 0) {
    rectangles.forEach(({ start, end }) => {
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
    });
  }

  if (triangles.length > 0) {
    triangles.forEach(({ start, end }) => {
      const { spx, spy, epx, epy, tpx, tpy } = getShapePoints({
        shape: "triangles",
        start,
        end
      });
      ctx.moveTo(spx, spy);
      ctx.lineTo(tpx, tpy);
      ctx.lineTo(epx, epy);
      ctx.closePath();
    });
  }

  if (tips) {
    const tipDistance = getAverageDistance(tips);

    tips.forEach((tip, index) => {
      if (!lastTips || !lastTips[index]) return;
      const { x: tipX, y: tipY } = tip;
      const { x: lastTipX, y: lastTipY } = lastTips[index];

      ctx.moveTo(lastTipX, lastTipY);

      ctx.lineWidth = getLineWidth({
        minimum,
        radius: radius * index + dispersion,
        tipDistance
      });

      ctx.quadraticCurveTo(lastTipX, lastTipY, tipX, tipY);
    });
  }

  ctx.stroke();
  lastTips = { ...tips } || null;
  return lastTips;
};
