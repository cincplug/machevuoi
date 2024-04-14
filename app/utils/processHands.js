import {
  getDistance,
  checkElementPinch,
  squeezePoints,
  processColor,
  clearCanvases
} from "./index";
import { pinchCanvas } from "./pinchCanvas";
import { scratchCanvas } from "./scratchCanvas";

let lastX, lastY, lastTips;

export const processHands = ({
  setupRef,
  hands,
  setCursor,
  setScribbleNewArea,
  dctx,
  pctx
}) => {
  const {
    pattern,
    radius,
    color,
    opacity,
    minimum,
    pinchThreshold,
    usesButtonPinch,
    isScratchCanvas,
    scratchPoints,
    dash,
    pressedKey,
    dispersion,
    doesWagDelete,
    composite
  } = setupRef.current;
  dctx.globalCompositeOperation = composite;
  pctx.globalCompositeOperation = "destination-atop";
  const ctx = pressedKey === "Shift" || !isScratchCanvas ? dctx : pctx;
  ctx.strokeStyle = processColor(color, opacity);
  let newPoints = [];
  if (!["paths"].includes(pattern)) {
    hands.forEach((hand) => {
      if (hand.keypoints) {
        newPoints = newPoints.concat(hand.keypoints);
      }
    });
  }
  const handPoints = hands[0]?.keypoints;
  const wrist = handPoints[0];
  const thumbTip = handPoints[4];
  const indexTip = handPoints[8];
  const middleTip = handPoints[12];
  const dots = scratchPoints.dots.map((point) => handPoints[point]);
  const tips = squeezePoints({
    points: dots,
    squeezeRatio: pinchThreshold,
    centeringContext: dots
  });

  const shapeNames = [
    "lines",
    "squares",
    "rectangles",
    "rhomboids",
    "triangles",
    "diamonds",
    "circles",
    "curves",
    "arcs",
    "ellipses"
  ];

  const shapes = shapeNames.reduce((result, shapeName) => {
    result[shapeName] = scratchPoints[shapeName].map((shape) => {
      const points = shape.map((point) => handPoints[point]);
      const squeezedPoints = squeezePoints({
        points,
        squeezeRatio: pinchThreshold,
        centeringContext: points
      });
      const shapeObject = { start: squeezedPoints[0], end: squeezedPoints[1] };
      if (shapeName === "curves" || shapeName === "ellipses") {
        shapeObject.control = squeezedPoints[1];
        shapeObject.end = squeezedPoints[2];
      }
      return shapeObject;
    });
    return result;
  }, {});

  const thumbIndexDistance = getDistance(thumbTip, indexTip);
  const isPinched =
    pressedKey === "Shift" || thumbIndexDistance < pinchThreshold;
  const isWagging =
    doesWagDelete &&
    (wrist.y - indexTip.y) / (wrist.y - middleTip.y) > 3 &&
    (wrist.y - indexTip.y) / (wrist.x - indexTip.x) > 3;
  const x = (thumbTip.x + indexTip.x) / 2;
  const y = (thumbTip.y + indexTip.y) / 2;
  setCursor((prevCursor) => {
    const threshold = prevCursor.isPinched
      ? pinchThreshold * 2
      : pinchThreshold;
    if (usesButtonPinch && thumbIndexDistance < pinchThreshold * 4) {
      checkElementPinch({ x, y, isPinched });
    }
    const nextCursor = isScratchCanvas ? { tips } : { x, y };
    nextCursor.isWagging = isWagging;
    nextCursor.isPinched = thumbIndexDistance < threshold;
    return nextCursor;
  });

  if (pattern === "canvas" && ctx) {
    ctx.setLineDash(dash ? [dash, dash] : []);
    ctx.lineJoin = "round";
    if (isWagging) {
      clearCanvases();
      lastX = undefined;
      lastY = undefined;
      lastTips = undefined;
    }
    if (isScratchCanvas) {
      lastTips = scratchCanvas({
        radius,
        minimum,
        ctx,
        color,
        opacity,
        tips,
        lastTips,
        pinchThreshold,
        pressedKey,
        dispersion,
        shapes
      });
    } else {
      lastTips = undefined;
    }
    if (isPinched && !isScratchCanvas) {
      let result = pinchCanvas({
        radius,
        thumbIndexDistance,
        minimum,
        ctx,
        color,
        opacity,
        pinchThreshold,
        x,
        y,
        lastX,
        lastY,
        dispersion
      });
      lastX = result.lastX;
      lastY = result.lastY;
    } else {
      lastX = undefined;
      lastY = undefined;
    }
  } else if (isPinched) {
    setScribbleNewArea((prevScribbleNewArea) => {
      const isNewArea =
        prevScribbleNewArea.length === 0 ||
        getDistance(prevScribbleNewArea[prevScribbleNewArea.length - 1], {
          x,
          y
        }) > minimum;
      if (isNewArea) {
        return [...prevScribbleNewArea, { x, y }];
      }
      return prevScribbleNewArea;
    });
  }
};
