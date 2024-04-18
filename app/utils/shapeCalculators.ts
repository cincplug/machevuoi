interface Point {
  x: number;
  y: number;
}

type ControlPoint = Point | null;

export const getShapePoints = ({
  shape,
  start,
  end,
  control
}: {
  shape: string;
  start: Point;
  end: Point;
  control?: ControlPoint;
}): any => {
  if (shape in shapeCalculators) {
    return shapeCalculators[shape]({ start, end, control });
  } else {
    throw new Error(`Shape calculator for shape '${shape}' not found`);
  }
};

type ShapeCalculator = ({
  start,
  end,
  control
}: {
  start: Point;
  end: Point;
  control?: ControlPoint;
}) => any;

const shapeCalculators: Record<string, ShapeCalculator> = {
  lines: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    return { spx, spy, epx, epy };
  },
  curves: ({
    start,
    control,
    end
  }: {
    start: Point;
    control?: ControlPoint;
    end: Point;
  }): any => {
    const cpx = control ? control.x : start.x;
    const cpy = control ? control.y : start.y;
    return { start, control, end, cpx, cpy };
  },
  arcs: ({ start, end }: { start: Point; end: Point }): any => {
    const mpx = (start.x + end.x) / 2;
    const mpy = (start.y + end.y) / 2;
    const slope = -(start.x - end.x) / (start.y - end.y);
    const distance =
      Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2) / 2;
    const cpx = mpx + distance / Math.sqrt(1 + slope ** 2);
    const cpy = mpy + slope * (cpx - mpx);
    return { cpx, cpy };
  },
  ellipses: ({
    start,
    control,
    end
  }: {
    start: Point;
    control?: ControlPoint;
    end: Point;
  }): any => {
    const distControl = control
      ? Math.sqrt((control.x - start.x) ** 2 + (control.y - start.y) ** 2)
      : 0;
    const distEnd = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    const rx = Math.max(distControl, distEnd);
    const ry = Math.min(distControl, distEnd);
    const rotation = control
      ? Math.atan2(control.y - start.y, control.x - start.x)
      : Math.atan2(end.y - start.y, end.x - start.x);
    const spx = start.x + rx * Math.cos(rotation);
    const spy = start.y + rx * Math.sin(rotation);
    return { spx, spy, rx, ry, rotation };
  },
  diamonds: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const mpx = (spx + epx) / 2;
    const mpy = (spy + epy) / 2;
    const cpx = mpx - (epy - spy) / 2;
    const cpy = mpy + (epx - spx) / 2;
    const apx = mpx + (epy - spy) / 2;
    const apy = mpy - (epx - spx) / 2;
    return { spx, spy, epx, epy, cpx, cpy, apx, apy };
  },
  squares: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const cpx = spx - (epy - spy);
    const cpy = spy + (epx - spx);
    const dpx = epx - (epy - spy);
    const dpy = epy + (epx - spx);
    return { spx, spy, epx, epy, cpx, cpy, dpx, dpy };
  },
  rhomboids: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const mpx = (spx + epx) / 2;
    const mpy = (spy + epy) / 2;
    const halfDiagonal = Math.sqrt((mpx - spx) ** 2 + (mpy - spy) ** 2);
    const cpx = mpx - halfDiagonal;
    const cpy = mpy + halfDiagonal;
    const dpx = mpx + halfDiagonal;
    const dpy = mpy - halfDiagonal;
    return { spx, spy, epx, epy, cpx, cpy, dpx, dpy };
  },
  circles: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const mpx = (spx + epx) / 2;
    const mpy = (spy + epy) / 2;
    const circleRadius = Math.sqrt((mpx - spx) ** 2 + (mpy - spy) ** 2);
    return { mpx, mpy, circleRadius };
  },
  rectangles: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const cpx = spx;
    const cpy = epy;
    const dpx = epx;
    const dpy = spy;
    return { spx, spy, epx, epy, cpx, cpy, dpx, dpy };
  },
  triangles: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const tpx = (spx + epx) / 2 - (Math.sqrt(3) * (epy - spy)) / 2;
    const tpy = (spy + epy) / 2 + (Math.sqrt(3) * (epx - spx)) / 2;
    return { spx, spy, epx, epy, tpx, tpy };
  }
};
