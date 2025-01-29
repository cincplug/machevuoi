import Arc from "./Arc";
import Line from "./Line";
import Square from "./Square";
import Diamond from "./Diamond";
import Rectangle from "./Rectangle";
import Triangle from "./Triangle";
import Curve from "./Curve";
import Circle from "./Circle";
import Ellipse from "./Ellipse";
import Bitmap from "./Bitmap";

const shapeComponents = {
  arcs: Arc,
  lines: Line,
  squares: Square,
  diamonds: Diamond,
  rectangles: Rectangle,
  triangles: Triangle,
  curves: Curve,
  circles: Circle,
  ellipses: Ellipse
} as const;

export const isKnownShape = (
  type: string
): type is keyof typeof shapeComponents => {
  return type in shapeComponents;
};

export const getShapeComponent = (type: string) => {
  if (isKnownShape(type)) {
    return shapeComponents[type];
  }
  return Bitmap;
};

export default shapeComponents;
