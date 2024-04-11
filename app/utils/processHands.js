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
  points,
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
    doesWagDelete
  } = setupRef.current;
  const ctx = pressedKey === "Shift" ? dctx : pctx;
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
  const lines = scratchPoints.lines.map((line) => {
    const squeezedPoints = squeezePoints({
      points: line.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });
  const squares = scratchPoints.squares.map((line) => {
    const squeezedPoints = squeezePoints({
      points: line.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });
  const rectangles = scratchPoints.rectangles.map((line) => {
    const squeezedPoints = squeezePoints({
      points: line.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });
  const rhomboids = scratchPoints.rhomboids.map((line) => {
    const squeezedPoints = squeezePoints({
      points: line.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });
  const triangles = scratchPoints.triangles.map((line) => {
    const squeezedPoints = squeezePoints({
      points: line.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });
  const diamonds = scratchPoints.diamonds.map((line) => {
    const squeezedPoints = squeezePoints({
      points: line.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });

  const circles = scratchPoints.circles.map((circle) => {
    const squeezedPoints = squeezePoints({
      points: circle.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return { start: squeezedPoints[0], end: squeezedPoints[1] };
  });

  const curves = scratchPoints.curves.map((curve) => {
    const squeezedPoints = squeezePoints({
      points: curve.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return {
      start: squeezedPoints[0],
      control: squeezedPoints[1],
      end: squeezedPoints[2]
    };
  });

  const arcs = scratchPoints.arcs.map((arc) => {
    const squeezedPoints = squeezePoints({
      points: arc.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return {
      start: squeezedPoints[0],
      control: squeezedPoints[1],
      end: squeezedPoints[2]
    };
  });

  const ovals = scratchPoints.ovals.map((oval) => {
    const squeezedPoints = squeezePoints({
      points: oval.map((point) => handPoints[point]),
      squeezeRatio: pinchThreshold,
      centeringContext: dots
    });
    return {
      start: squeezedPoints[0],
      control: squeezedPoints[1],
      end: squeezedPoints[2]
    };
  });

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
        lines,
        curves,
        arcs,
        ovals,
        circles,
        squares,
        rhomboids,
        rectangles,
        triangles,
        diamonds
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
  return [...points, ...newPoints];
};
