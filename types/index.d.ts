export interface ISetup {
  [key: string]: string | number | boolean | object | array | null;
}
export interface IControl {
  [key: string]: string | number | boolean | object | array | null;
}
export interface IPoint {
  x: number;
  y: number;
}

export interface ICursor extends IPoint {
  isPinched: boolean;
  isWagging: boolean;
}

export interface IShape {
  start: Point;
  end: Point;
  control?: Point;
}

export interface IShapes {
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

export type NullablePoint = IPoint | null;

export type ChangeEventType =
  | React.ChangeEvent<HTMLInputElement>
  | {
      target: {
        value: string | number | boolean | object | null;
        id: string;
        type: string;
      };
    };
