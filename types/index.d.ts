export interface Point {
  x: number;
  y: number;
}

export interface Cursor extends Point {
  isPinched: boolean;
  isWagging: boolean;
}

export type NullablePoint = Point | null;
export interface Shape {
  start: Point;
  end: Point;
  control?: Point;
}

export interface Shapes {
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
