interface Point {
  x: number;
  y: number;
}

export const getDistance = (point1: Point, point2: Point): number => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getAverageDistance = (points: Point[]): number => {
  const distances = points.flatMap((point1, index1) =>
    points.slice(index1 + 1).map((point2) => getDistance(point1, point2))
  );

  const totalDistance = distances.reduce((a, b) => a + b, 0);
  return totalDistance / distances.length;
};

type NullablePoint = Point | null;

export const squeezePoints = ({
  points,
  squeezeRatio,
  centeringContext
}: {
  points: Point[];
  squeezeRatio: number;
  centeringContext: Point[];
}): NullablePoint[] => {
  if (!points || points.length === 0) {
    return [];
  }
  const center = centeringContext.reduce(
    (total, point, _index, array) => {
      if (point) {
        return {
          x: total.x + point.x / array.length,
          y: total.y + point.y / array.length
        };
      } else {
        return total;
      }
    },
    { x: 0, y: 0 }
  );
  return points.map((point) => {
    if (point) {
      return {
        x: center.x + ((point.x - center.x) * squeezeRatio) / 100,
        y: center.y + ((point.y - center.y) * squeezeRatio) / 100
      };
    } else {
      return null;
    }
  }).filter(item => item !== null);
};



export const processColor = (color: string, opacity: number): string => {
  return `${color}${Math.min(255, Math.max(0, Math.round(opacity)))
    .toString(16)
    .padStart(2, "0")}`;
};

interface RenderPathProps {
  area: number[];
  points: Point[];
  radius: number;
}

export const renderPath = ({ area, points, radius }: RenderPathProps): string =>
  area
    .map((activeAreaPoint, activeAreaPointIndex) => {
      const thisPoint = points[activeAreaPoint];
      if (!thisPoint) return null;
      const lastPoint = points[area[activeAreaPointIndex - 1]];
      if (radius > 0 && lastPoint) {
        const deltaX = thisPoint.x - lastPoint.x;
        const deltaY = thisPoint.y - lastPoint.y;
        const h = Math.hypot(deltaX, deltaY) + radius;
        const controlPointX = lastPoint.x + deltaX / 2 + (radius * deltaY) / h;
        const controlPointY = lastPoint.y + deltaY / 2 - (radius * deltaX) / h;
        return `Q${controlPointX},${controlPointY} ${thisPoint.x},${thisPoint.y}`;
      } else {
        return `${activeAreaPointIndex === 0 ? "M" : "L"} ${thisPoint.x},${
          thisPoint.y
        }`;
      }
    })
    .join(" ");

export const saveSetup = (setup: string): void => {
  navigator.clipboard.writeText(setup);
  console.info(setup);
};

export const saveImage = (): void => {
  const link = document.createElement("a");
  const svgElement = document.querySelector(".drawing");
  const canvasElement = document.querySelector(".canvas") as HTMLCanvasElement;
  if (svgElement) {
    link.download = "lukonica-scribble.svg";
    const base64doc = Buffer.from(
      decodeURIComponent(encodeURIComponent(svgElement.outerHTML))
    ).toString("base64");
    const e = new MouseEvent("click");
    link.href = "data:image/svg+xml;base64," + base64doc;
    link.dispatchEvent(e);
  } else if (canvasElement) {
    link.download = "lukonica-canvas.png";
    link.setAttribute(
      "href",
      canvasElement
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
    );
    link.click();
  }
};

interface PinchProps {
  x: number;
  y: number;
  isPinched: boolean;
}

export const checkElementPinch = ({ x, y, isPinched }: PinchProps): void => {
  const element = document.elementFromPoint(x, y) as HTMLElement;
  if (!element) {
    return;
  }
  if (element.tagName === "BUTTON") {
    clearHighlight();
    element.classList.add("highlight");
    if (isPinched) {
      element.click();
      element.classList.remove("highlight");
    }
  } else {
    clearHighlight();
  }
};

const clearHighlight = (): void => {
  const highlightedElement = document.querySelector(".highlight");
  if (highlightedElement) {
    highlightedElement.classList.remove("highlight");
  }
};

export const arraysHaveSameElements = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((a, b) => a - b);
  const sortedB = [...b].sort((a, b) => a - b);
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
};

export const clearCanvases = (): void => {
  const canvasElements = document.querySelectorAll("canvas");
  canvasElements.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
};

type ShapePoint = number;
type Shape = ShapePoint[];
type HandlePathClick = (shape: {
  start: ShapePoint;
  control: ShapePoint | null;
  end: ShapePoint;
  type: string;
}) => void;
type ShapeType = string;
interface ShapeProps {
  selectedShapes: Shape[];
  handlePathClick: HandlePathClick;
  shapeType: ShapeType;
}

type ShapeReturn = {
  shape: {
    startPoint: ShapePoint;
    controlPoint: ShapePoint | null;
    endPoint: ShapePoint;
  };
  onClick: () => void;
}[];

export const getShape = ({
  selectedShapes,
  handlePathClick,
  shapeType
}: ShapeProps): ShapeReturn => {
  return selectedShapes.map((shape) => {
    const startPoint = shape[0];
    const controlPoint = shape.length === 3 ? shape[1] : null;
    const endPoint = shape.length === 3 ? shape[2] : shape[1];
    return {
      shape: { startPoint, controlPoint, endPoint },
      onClick: () =>
        handlePathClick({
          start: startPoint,
          control: controlPoint,
          end: endPoint,
          type: shapeType
        })
    };
  });
};
