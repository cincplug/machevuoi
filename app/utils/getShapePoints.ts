interface Point {
  x: number;
  y: number;
}

type ControlPoint = Point | null;

export const getShapePoints = ({ shape, start, end, control }: { shape: string; start: Point; end: Point; control?: ControlPoint }): any => {
  if (shape in shapeCalculators) {
    return shapeCalculators[shape]({ start, end, control });
  } else {
    throw new Error(`Shape calculator for shape '${shape}' not found`);
  }
};

type ShapeCalculator = ({ start, end, control }: { start: Point; end: Point; control?: ControlPoint }) => any;

const shapeCalculators: Record<string, ShapeCalculator> = {
  lines: ({ start, end }: { start: Point; end: Point }): any => {
    const startX = start.x;
    const startY = start.y;
    const endX = end.x;
    const endY = end.y;
    return { startX, startY, endX, endY };
  },
  curves: ({ start, control, end }: { start: Point; control?: ControlPoint; end: Point }): any => {
    const controlX = control ? control.x : start.x;
    const controlY = control ? control.y : start.y;
    return { start, control, end, controlX, controlY };
  },
  arcs: ({ start, end }: { start: Point; end: Point }): any => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const slope = -(start.x - end.x) / (start.y - end.y);
    const distance = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2) / 2;
    const controlX = midX + distance / Math.sqrt(1 + slope ** 2);
    const controlY = midY + slope * (controlX - midX);
    return { start, end, midX, midY, controlX, controlY };
  },
  ellipses: ({ start, control, end }: { start: Point; control?: ControlPoint; end: Point }): any => {
    const distControl = control ? Math.sqrt((control.x - start.x) ** 2 + (control.y - start.y) ** 2) : 0;
    const distEnd = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
    const rx = Math.max(distControl, distEnd);
    const ry = Math.min(distControl, distEnd);
    const rotation = control ? (Math.atan2(control.y - start.y, control.x - start.x)) : (Math.atan2(end.y - start.y, end.x - start.x));
    const startX = start.x + rx * Math.cos(rotation);
    const startY = start.y + rx * Math.sin(rotation);
    return { startX, startY, rx, ry, rotation };
  },
  diamonds: ({ start, end }: { start: Point; end: Point }): any => {
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
    return { spx, spy, epx, epy, cpx, cpy, apx, apy };
  },
  squares: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const sideLength = Math.sqrt((epx - spx) ** 2 + (epy - spy) ** 2);
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
    const midx = (spx + epx) / 2;
    const midy = (spy + epy) / 2;
    const halfDiagonal = Math.sqrt((midx - spx) ** 2 + (midy - spy) ** 2);
    const cpx = midx - halfDiagonal;
    const cpy = midy + halfDiagonal;
    const dpx = midx + halfDiagonal;
    const dpy = midy - halfDiagonal;
    return { spx, spy, epx, epy, cpx, cpy, dpx, dpy };
  },
  circles: ({ start, end }: { start: Point; end: Point }): any => {
    const spx = start.x;
    const spy = start.y;
    const epx = end.x;
    const epy = end.y;
    const midx = (spx + epx) / 2;
    const midy = (spy + epy) / 2;
    const circleRadius = Math.sqrt((midx - spx) ** 2 + (midy - spy) ** 2);
    return { spx, spy, epx, epy, midx, midy, circleRadius };
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
  },
};
