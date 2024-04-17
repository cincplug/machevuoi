import { getAverageDistance } from "./index";

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

const getLineWidth = ({ minimum, radius, tipDistance }: { minimum: number; radius: number; tipDistance: number }): number => {
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
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    });
  }

  if (curves.length > 0) {
    curves.forEach(({ start, control, end }) => {
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(control!.x, control!.y, end.x, end.y);
    });
  }

  if (arcs.length > 0) {
    arcs.forEach(({ start, end }) => {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2;
      const slope = -(start.x - end.x) / (start.y - end.y);
      const distance =
        Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2) / 2;
      const controlX = midX + distance / Math.sqrt(1 + slope ** 2);
      const controlY = midY + slope * (controlX - midX);
      ctx.moveTo(start.x, start.y);
      ctx.quadraticCurveTo(controlX, controlY, end.x, end.y);
    });
  }

  if (ellipses.length > 0) {
    ellipses.forEach(({ start, control, end }) => {
      const distControl = Math.sqrt(
        (control!.x - start.x) ** 2 + (control!.y - start.y) ** 2
      );
      const distEnd = Math.sqrt(
        (end.x - start.x) ** 2 + (end.y - start.y) ** 2
      );
      const rx = Math.max(distControl, distEnd);
      const ry = Math.min(distControl, distEnd);
      const rotation =
        distControl > distEnd
          ? Math.atan2(control!.y - start.y, control!.x - start.x)
          : Math.atan2(end.y - start.y, end.x - start.x);

      const startX = start.x + rx * Math.cos(rotation);
      const startY = start.y + rx * Math.sin(rotation);

      ctx.moveTo(startX, startY);
      ctx.ellipse(start.x, start.y, rx, ry, rotation, 0, 2 * Math.PI);
    });
  }

  if (circles.length > 0) {
    circles.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const midx = (spx + epx) / 2;
      const midy = (spy + epy) / 2;

      const circleRadius = Math.sqrt((midx - spx) ** 2 + (midy - spy) ** 2);

      ctx.moveTo(midx + circleRadius, midy);
      ctx.arc(midx, midy, circleRadius, 0, 2 * Math.PI);
    });
  }

  if (rectangles.length > 0) {
    rectangles.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const cpx = spx;
      const cpy = epy;
      const dpx = epx;
      const dpy = spy;

      ctx.moveTo(spx, spy);
      ctx.lineTo(cpx, cpy);
      ctx.lineTo(epx, epy);
      ctx.lineTo(dpx, dpy);
      ctx.closePath();
    });
  }

  if (triangles.length > 0) {
    triangles.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const tpx = (spx + epx) / 2 - (Math.sqrt(3) * (epy - spy)) / 2;
      const tpy = (spy + epy) / 2 + (Math.sqrt(3) * (epx - spx)) / 2;

      ctx.moveTo(spx, spy);
      ctx.lineTo(tpx, tpy);
      ctx.lineTo(epx, epy);
      ctx.closePath();
    });
  }

  if (squares.length > 0) {
    squares.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const sideLength = Math.sqrt((epx - spx) ** 2 + (epy - spy) ** 2);

      const cpx = spx - (epy - spy);
      const cpy = spy + (epx - spx);
      const dpx = epx - (epy - spy);
      const dpy = epy + (epx - spx);

      ctx.moveTo(spx, spy);
      ctx.lineTo(cpx, cpy);
      ctx.lineTo(dpx, dpy);
      ctx.lineTo(epx, epy);
      ctx.closePath();
    });
  }

  if (diamonds.length > 0) {
    diamonds.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const midx = (spx + epx) / 2;
      const midy = (spy + epy) / 2;

      const cpx = midx - (epy - spy) / 2;
      const cpy = midy + (epx - spx) / 2;
      const apx = midx + (epy - spy) / 2;
      const apy = midy - (epx - spx) / 2;

      ctx.moveTo(spx, spy);
      ctx.lineTo(cpx, cpy);
      ctx.lineTo(epx, epy);
      ctx.lineTo(apx, apy);
      ctx.closePath();
    });
  }

  if (rhomboids.length > 0) {
    rhomboids.forEach(({ start, end }) => {
      const spx = start.x;
      const spy = start.y;
      const epx = end.x;
      const epy = end.y;

      const midx = (spx + epx) / 2;
      const midy = (spy + epy) / 2;

      const halfDiagonal = Math.sqrt((midx - spx) ** 2 + (midy - spy) ** 2);

      const cpx = midx - halfDiagonal;
      const cpy = midy + halfDiagonal;
      const dpx = midx + halfDiagonal;
      const dpy = midy - halfDiagonal;

      ctx.moveTo(spx, spy);
      ctx.lineTo(cpx, cpy);
      ctx.lineTo(epx, epy);
      ctx.lineTo(dpx, dpy);
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
