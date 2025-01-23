import { ShapeComponentsType } from "../../../types";
import Arc from "./Arc";
import Line from "./Line";
import Square from "./Square";
import Diamond from "./Diamond";
import Rhomboid from "./Rhomboid";
import Rectangle from "./Rectangle";
import Triangle from "./Triangle";
import Curve from "./Curve";
import Circle from "./Circle";
import Ellipse from "./Ellipse";
import Bitmap from "./Bitmap";

const shapeComponents: ShapeComponentsType = {
  arcs: Arc,
  lines: Line,
  squares: Square,
  diamonds: Diamond,
  rectangles: Rectangle,
  rhomboids: Rhomboid,
  triangles: Triangle,
  curves: Curve,
  circles: Circle,
  ellipses: Ellipse,
  bitmaps: Bitmap
};

export default shapeComponents;
