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
  lastX: number | undefined;
  lastY: number | undefined;
  isPinched: boolean;
  isWagging: boolean;
}

export interface IShape {
  startPoint: IPoint;
  endPoint: IPoint;
  controlPoint?: IPoint;
}

export interface IShapeWithControl extends IShape {
  controlPoint: IPoint;
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

export type UpdateSetupType = {
  id: string;
  value: string | number | boolean | object | null;
  type: string;
};

export type ShapeComponentProps = {
  shape: IShape;
  title?: string;
  onClick: any;
  isPreview?: boolean;
};

export type ShapeComponentWithControlPointProps = ShapeComponentProps & {
  shape: IShapeWithControl;
};

export type ShapeComponentsType = {
  arcs: React.FC<ShapeComponentProps>;
  lines: React.FC<ShapeComponentProps>;
  squares: React.FC<ShapeComponentProps>;
  diamonds: React.FC<ShapeComponentProps>;
  rectangles: React.FC<ShapeComponentProps>;
  rhomboids: React.FC<ShapeComponentProps>;
  triangles: React.FC<ShapeComponentProps>;
  circles: React.FC<ShapeComponentProps>;
  curves: React.FC<ShapeComponentWithControlPointProps>;
  ellipses: React.FC<ShapeComponentWithControlPointProps>;
};
