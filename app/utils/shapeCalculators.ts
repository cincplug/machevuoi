import { IPoint } from "../../types";

type ControlPoint = IPoint | null;

export const getShapePoints = ({
  shape,
  startPoint,
  endPoint,
  controlPoint
}: {
  shape: string;
  startPoint: IPoint;
  endPoint: IPoint;
  controlPoint?: ControlPoint;
}): any => {
  if (shape in shapeCalculators) {
    return shapeCalculators[shape]({ startPoint, endPoint, controlPoint });
  } else {
    throw new Error(`Shape calculator for shape '${shape}' not found`);
  }
};

type ShapeCalculator = ({
  startPoint,
  endPoint,
  controlPoint
}: {
  startPoint: IPoint;
  endPoint: IPoint;
  controlPoint?: ControlPoint;
}) => any;

export const shapeCalculators: Record<string, ShapeCalculator> = {
  lines: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;
    return { spx, spy, epx, epy };
  },
  curves: ({
    startPoint,
    controlPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
    controlPoint?: ControlPoint;
  }): any => {
    const cpx = controlPoint ? controlPoint.x : startPoint.x;
    const cpy = controlPoint ? controlPoint.y : startPoint.y;
    return { startPoint, controlPoint, endPoint, cpx, cpy };
  },
  arcs: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;
    const mpx = (spx + epx) / 2;
    const mpy = (spy + epy) / 2;
    const slope = -(spx - epx) / (spy - epy);
    const distance = Math.sqrt((spx - epx) ** 2 + (spy - epy) ** 2) / 2;

    let cpx, cpy;
    if (spx < epx) {
      cpx = mpx + distance / Math.sqrt(1 + slope ** 2);
    } else {
      cpx = mpx - distance / Math.sqrt(1 + slope ** 2);
    }

    cpy = mpy + slope * (cpx - mpx);
    return { cpx, cpy };
  },
  ellipses: ({
    startPoint,
    controlPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
    controlPoint?: ControlPoint;
  }): any => {
    const distControl = controlPoint
      ? Math.sqrt(
          (controlPoint.x - startPoint.x) ** 2 +
            (controlPoint.y - startPoint.y) ** 2
        )
      : 0;
    const distendPoint = Math.sqrt(
      (endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2
    );
    const rx = Math.max(distControl, distendPoint);
    const ry = Math.min(distControl, distendPoint);
    const rotation = controlPoint
      ? Math.atan2(controlPoint.y - startPoint.y, controlPoint.x - startPoint.x)
      : Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const spx = startPoint.x + rx * Math.cos(rotation);
    const spy = startPoint.y + rx * Math.sin(rotation);
    return { spx, spy, rx, ry, rotation };
  },
  diamonds: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;
    const mpx = (spx + epx) / 2;
    const mpy = (spy + epy) / 2;
    const cpx = mpx - (epy - spy) / 2;
    const cpy = mpy + (epx - spx) / 2;
    const apx = mpx + (epy - spy) / 2;
    const apy = mpy - (epx - spx) / 2;
    return { spx, spy, epx, epy, cpx, cpy, apx, apy };
  },
  squares: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;
    const cpx = spx - (epy - spy);
    const cpy = spy + (epx - spx);
    const dpx = epx - (epy - spy);
    const dpy = epy + (epx - spx);
    return { spx, spy, epx, epy, cpx, cpy, dpx, dpy };
  },
  circles: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;
    const mpx = (spx + epx) / 2;
    const mpy = (spy + epy) / 2;
    const circleRadius = Math.sqrt((mpx - spx) ** 2 + (mpy - spy) ** 2);
    return { mpx, mpy, circleRadius };
  },
  rectangles: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;

    let cpx, cpy, dpx, dpy;
    if (spx < epx) {
      cpx = epx;
      cpy = spy;
      dpx = spx;
      dpy = epy;
    } else {
      cpx = spx;
      cpy = epy;
      dpx = epx;
      dpy = spy;
    }

    return { spx, spy, epx, epy, cpx, cpy, dpx, dpy };
  },
  triangles: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): any => {
    const spx = startPoint.x;
    const spy = startPoint.y;
    const epx = endPoint.x;
    const epy = endPoint.y;
    const tpx = (spx + epx) / 2 - (Math.sqrt(3) * (epy - spy)) / 2;
    const tpy = (spy + epy) / 2 + (Math.sqrt(3) * (epx - spx)) / 2;
    return { spx, spy, epx, epy, tpx, tpy };
  },
  bitmaps: ({
    startPoint,
    endPoint
  }: {
    startPoint: IPoint;
    endPoint: IPoint;
  }): IPoint[] => {
    return [startPoint, endPoint];
  }
};
