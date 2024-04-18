import { getAverageDistance } from "./index";
import { shapePainters } from './shapePainters'; 

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
}: ScratchCanvasOptions): void => {
  ctx.beginPath();
  Object.keys(shapes).forEach((shapeName) => {
    const shapeList = shapes[shapeName as keyof Shapes];
    shapeList.forEach((shape: Shape) => {
      const painter = shapePainters[shapeName];
      if (painter) {
        painter({ ctx, ...shape });
      }
    });
  });
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
};
