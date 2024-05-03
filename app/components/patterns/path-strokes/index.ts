import { IPoint } from "../../../../types";

type StrokeType = "lines" | "cloud" | "flute" | "beziers" | "cable";

interface PathStrokeProps {
  pathStroke: StrokeType;
  thisPoint: IPoint;
  nextPoint: IPoint;
  radius: number;
}

const pathStrokes = ({
  pathStroke,
  thisPoint,
  nextPoint,
  radius
}: PathStrokeProps) => {
  const strokeDefinitions = {
    beziers: `Q ${thisPoint.x} ${thisPoint.y}, ${
      (thisPoint.x + nextPoint.x) / 2
    } ${(thisPoint.y + nextPoint.y) / 2}`,
    lines: `L${thisPoint.x} ${thisPoint.y} `,
    cloud: `A${radius} ${radius} 0 0 1 ${thisPoint.x} ${thisPoint.y}`,
    flute: `A1,1 0 0 1 ${thisPoint.x},${thisPoint.y}
    A4,4 0 0 1 ${nextPoint.x},${nextPoint.y}
    A6,6 0 0 1 ${thisPoint.x},${thisPoint.y}
    A8,8 0 0 1 ${nextPoint.x},${nextPoint.y}
    A11,11 0 0 1 ${thisPoint.x},${thisPoint.y}`,
    cable: `C${thisPoint.x + radius * radius},${
      thisPoint.y + radius * radius
    } ${nextPoint.x - radius * radius},${nextPoint.y - radius * radius} ${
      nextPoint.x
    },${nextPoint.y}`
  };
  return strokeDefinitions[pathStroke];
};

export default pathStrokes;
