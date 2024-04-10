import HP from "../data/handPoints.json";

export const getDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getAverageDistance = (points) => {
  const distances = points.flatMap((point1, index1) =>
    points.slice(index1 + 1).map((point2) => getDistance(point1, point2))
  );

  const totalDistance = distances.reduce((a, b) => a + b, 0);
  return totalDistance / distances.length;
};

export const squeezePoints = ({ points, squeezeRatio, centeringContext }) => {
  if (!points || points.length === 0) {
    return null;
  }
  const center = centeringContext.reduce(
    (total, point, index, array) => {
      return {
        x: total.x + point.x / array.length,
        y: total.y + point.y / array.length
      };
    },
    { x: 0, y: 0 }
  );
  return points.map((point) => {
    return {
      x: center.x + ((point.x - center.x) * squeezeRatio) / 100,
      y: center.y + ((point.y - center.y) * squeezeRatio) / 100
    };
  });
};

export const processColor = (color, opacity) => {
  return `${color}${Math.min(255, Math.max(0, Math.round(opacity)))
    .toString(16)
    .padStart(2, "0")}`;
};

export const renderPath = ({ area, points, radius }) =>
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

export const saveSetup = (setup) => {
  navigator.clipboard.writeText(setup);
  console.info(setup);
};

export const saveImage = () => {
  const link = document.createElement("a");
  const svgElement = document.querySelector(".drawing");
  const canvasElement = document.querySelector(".canvas");
  if (svgElement) {
    link.download = "lukonica-scribble.svg";
    const base64doc = Buffer.from(
      decodeURIComponent(encodeURIComponent(svgElement.outerHTML))
    ).toString("base64");
    const e = new MouseEvent("click");
    link.href = "data:image/svg+xml;base64," + base64doc;
    link.dispatchEvent(e);
  } else {
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

export const checkElementPinch = ({ x, y, isPinched }) => {
  const element = document.elementFromPoint(x, y);
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

const clearHighlight = () => {
  const highlightedElement = document.querySelector(".highlight");
  if (highlightedElement) {
    highlightedElement.classList.remove("highlight");
  }
};

export const arraysAreEqual = (a, b) => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

export const arraysHaveSameElements = (a, b) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
};

export const clearCanvases = () => {
  const canvasElements = document.querySelectorAll("canvas");
  canvasElements.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
};

export const getShape = (selectedShapes, handlePathClick, shapeType) => {
  return selectedShapes.map((shape) => {
    return {
      shape,
      isSelected: true,
      onClick: () =>
        handlePathClick({
          start: shape[0],
          control: shape[1],
          end: shape[2],
          type: shapeType
        })
    };
  });
};
