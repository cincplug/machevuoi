import {
  findClosestFacePointIndex,
  getDistance,
  checkElementPinch,
  squeezePoints
} from "./index";
import { pinchCanvas } from "./pinchCanvas";
import { scratchCanvas } from "./scratchCanvas";

let lastX, lastY, lastTips;

export const processHands = ({
  setupRef,
  hands,
  points,
  setCursor,
  setCustomMaskNewArea,
  setCustomMask,
  setScribbleNewArea,
  ctx
}) => {
  const {
    pattern,
    radius,
    color,
    opacity,
    growth,
    minimum,
    pinchThreshold,
    usesButtonPinch,
    showsFaces,
    isScratchCanvas,
    scratchPattern,
    scratchPoints,
    dash,
    isSpacePressed,
    composite,
    dispersion
  } = setupRef.current;
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
  const tips = squeezePoints({
    points: scratchPoints.map((point) => handPoints[point]),
    squeezeRatio: pinchThreshold
  });
  const thumbIndexDistance = getDistance(thumbTip, indexTip);
  const isPinched = isSpacePressed || thumbIndexDistance < pinchThreshold;
  const isWagging =
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

  if (showsFaces && isPinched) {
    const closestPoint = findClosestFacePointIndex({
      facePoints: points,
      indexTip,
      pinchThreshold
    });

    if (closestPoint) {
      setCustomMaskNewArea((prevCustomMaskNewArea) => {
        const isNewArea =
          prevCustomMaskNewArea.length === 0 ||
          prevCustomMaskNewArea[0] !== closestPoint;
        if (isNewArea) {
          return [...prevCustomMaskNewArea, closestPoint];
        } else {
          setCustomMask((prevCustomMask) => [
            ...prevCustomMask,
            prevCustomMaskNewArea
          ]);
          return [];
        }
      });
    }
  }
  if (!showsFaces) {
    if (pattern === "canvas" && ctx) {
      ctx.setLineDash(dash ? [dash, dash] : []);
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation = composite;
      if (isWagging) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        lastX = undefined;
        lastY = undefined;
        lastTips = undefined;
      }
      if (isScratchCanvas) {
        lastTips = scratchCanvas({
          radius,
          growth,
          minimum,
          ctx,
          color,
          opacity,
          tips,
          scratchPattern,
          lastTips,
          pinchThreshold,
          isSpacePressed,
          dispersion
        });
      } else {
        lastTips = undefined;
      }
      if (isPinched && !isScratchCanvas) {
        let result = pinchCanvas({
          radius,
          thumbIndexDistance,
          growth,
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
  }
  return [...points, ...newPoints];
};
