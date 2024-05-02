import { IPoint } from "../../../../types";

type StrokeType =
  | "lines"
  | "cloud"
  | "blast"
  | "beziers"
  | "peas";

interface PathStrokeProps {
  pathStroke: StrokeType;
  thisPoint: IPoint;
  controlPoint: IPoint;
  nextPoint: IPoint;
  radius: number;
}

const pathStrokes = ({
  pathStroke,
  thisPoint,
  controlPoint,
  nextPoint,
  radius,
}: PathStrokeProps) => {
  const strokeDefinitions = {
    beziers: `Q ${thisPoint.x} ${thisPoint.y}, ${
      (thisPoint.x + nextPoint.x) / 2
    } ${(thisPoint.y + nextPoint.y) / 2}`,
    lines: `L${thisPoint.x} ${thisPoint.y} `,
    cloud: `A${radius} ${radius} 0 0 1 ${thisPoint.x} ${
      thisPoint.y
    }`,
    blast: `Q ${thisPoint.x} ${thisPoint.y} ${controlPoint.x} ${controlPoint.y}`,
    peas: `C ${nextPoint.x} ${nextPoint.y}, ${nextPoint.x} ${
      nextPoint.y
    }, ${(nextPoint.x + thisPoint.x) / 2} ${(nextPoint.y + thisPoint.y) / 2}`
  };
  return strokeDefinitions[pathStroke];
};

export default pathStrokes;
