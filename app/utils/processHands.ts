import { IPoint, ICursor, ISetup, IShapes } from "../../types";
import {
  getDistance,
  checkElementPinch,
  squeezePoints,
  processColor,
  clearCanvases
} from "./index";
import { pinchCanvas } from "./pinchCanvas";
import { scratchCanvas } from "./scratchCanvas";

let lastX: number | undefined,
  lastY: number | undefined,
  lastTips: IPoint[] | undefined;

interface Keypoint {
  x: number;
  y: number;
  name: string;
}

interface Keypoint3D extends Keypoint {
  z: number;
}

interface Hand {
  score: number;
  handedness: "Left" | "Right";
  keypoints: Keypoint[];
  keypoints3D: Keypoint3D[];
}

export const processHands = ({
  setup,
  hands,
  setCursor,
  setScribbleNewArea,
  dctx,
  pctx
}: {
  setup: ISetup;
  hands: Hand[];
  setCursor: React.Dispatch<React.SetStateAction<ICursor>>;
  setScribbleNewArea: React.Dispatch<React.SetStateAction<IPoint[]>>;
  dctx: CanvasRenderingContext2D | null;
  pctx: CanvasRenderingContext2D | null;
}) => {
  const {
    pattern,
    radius,
    color,
    opacity,
    minimum,
    pinchThreshold,
    squeezeRatio,
    usesButtonPinch,
    isScratchCanvas,
    scratchPoints,
    dash,
    pressedKey,
    dispersion,
    doesPinchDraw,
    doesWagDelete,
    composite,
    isCapsLock,
    activeLayer
  } = setup;

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

  hands.forEach((hand, handIndex) => {
    let newPoints: IPoint[] = [];
    if (!["paths"].includes(pattern as string)) {
      if (hand.keypoints) {
        newPoints = newPoints.concat(hand.keypoints);
      }
    }
    const wrist = hand.keypoints[0];
    const thumbTip = hand.keypoints[4];
    const indexTip = hand.keypoints[8];
    const middleTip = hand.keypoints[12];
    const dots = scratchPoints?.dots.map(
      (point: number) => hand.keypoints[point]
    );
    const tips = squeezePoints({
      points: dots,
      squeezeRatio,
      centeringContext: dots
    });

    const shapes = shapeNames.reduce(
      (result: { [key: string]: any }, shapeName) => {
        result[shapeName] = scratchPoints[shapeName].map((shape: number[]) => {
          const points = shape.map((point) => hand.keypoints[point]);
          const squeezedPoints = squeezePoints({
            points,
            squeezeRatio,
            centeringContext: points
          });

          if (squeezedPoints) {
            if (squeezedPoints[0] && squeezedPoints[1]) {
              let shapeObject:
                | { start: IPoint; end: IPoint }
                | { start: IPoint; control: IPoint; end: IPoint } = {
                start: squeezedPoints[0],
                end: squeezedPoints[1]
              };
              if (
                (shapeName === "curves" || shapeName === "ellipses") &&
                squeezedPoints[2]
              ) {
                shapeObject = {
                  start: squeezedPoints[0],
                  control: squeezedPoints[1],
                  end: squeezedPoints[2]
                };
              }

              return shapeObject;
            }
          }
        });
        return result;
      },
      {}
    );

    if (!thumbTip || !indexTip) {
      return;
    }
    const thumbIndexDistance = getDistance(thumbTip, indexTip);
    const isPinched = thumbIndexDistance < pinchThreshold;
    const isDrawing =
      pressedKey === "Shift" ||
      isCapsLock ||
      (doesPinchDraw && isPinched);
    const isWagging =
      doesWagDelete &&
      (wrist.y - indexTip.y) / (wrist.y - middleTip.y) > 3 &&
      (wrist.y - indexTip.y) / (wrist.x - indexTip.x) > 3;
    const x = (thumbTip.x + indexTip.x) / 2;
    const y = (thumbTip.y + indexTip.y) / 2;
    setCursor((prevCursor: ICursor) => {
      const threshold = prevCursor.isPinched
        ? (pinchThreshold as number) * 2
        : pinchThreshold;
      if (usesButtonPinch && thumbIndexDistance < pinchThreshold * 4) {
        checkElementPinch({ x, y, isPinched });
      }
      const nextCursor: ICursor = {
        x,
        y,
        isWagging: isWagging,
        isPinched: thumbIndexDistance < threshold
      };
      return nextCursor;
    });

    if (pattern === "canvas") {
      const ctx = isDrawing ? dctx : pctx;
      if (ctx === null) return null;
      if (!isDrawing && handIndex === 0) {
        dctx?.beginPath();
        dctx?.moveTo(x, y);
        pctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        pctx?.beginPath();
      }
      if (isDrawing && dctx) {
        pctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        dctx.globalCompositeOperation = composite as GlobalCompositeOperation;
      }
      ctx.strokeStyle = processColor(color as string, opacity as number);
      ctx.setLineDash(dash ? [dash, dash] : []);
      ctx.lineJoin = "round";
      if (isWagging) {
        clearCanvases();
        lastX = undefined;
        lastY = undefined;
        lastTips = undefined;
      }
      if (isScratchCanvas) {
        scratchCanvas({
          radius,
          minimum,
          ctx,
          tips: tips as IPoint[],
          lastTips: lastTips || [],
          dispersion,
          shapes: shapes as IShapes,
          handIndex: handIndex as number
        });
        lastTips = tips as IPoint[];
      } else {
        lastTips = undefined;
      }
      if (!isScratchCanvas) {
        pinchCanvas({
          radius,
          thumbIndexDistance,
          minimum,
          ctx,
          dispersion,
          x,
          y,
          lastX: lastX || x,
          lastY: lastY || y,
          activeLayer
        });
        lastX = x;
        lastY = y;
      } else {
        lastX = undefined;
        lastY = undefined;
      }
    } else if (isDrawing) {
      setScribbleNewArea((prevScribbleNewArea: IPoint[]) => {
        const isNewArea =
          prevScribbleNewArea.length === 0 ||
          getDistance(prevScribbleNewArea[prevScribbleNewArea.length - 1], {
            x,
            y
          }) > minimum;
        if (isNewArea) {
          setScribbleNewArea([...prevScribbleNewArea, { x, y }]);
        } else {
          setScribbleNewArea(prevScribbleNewArea);
        }
        return prevScribbleNewArea;
      });
    }
  });
};
