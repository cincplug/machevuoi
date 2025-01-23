import {
  getDistance,
  checkElementPinch,
  squeezePoints,
  processColor,
  clearCanvases,
  getExtendedHandPoints
} from "./index";
import { pinchCanvas } from "./pinchCanvas";
import { scratchCanvas } from "./scratchCanvas";
import { IPoint, ICursor, ISetup, IShapes, IShape } from "../../types";

interface ProcessHandsProps {
  setup: ISetup;
  hands: Hand[];
  setCursor: React.Dispatch<React.SetStateAction<ICursor>>;
  setScribbleNewArea: React.Dispatch<React.SetStateAction<IPoint[]>>;
  dctx: CanvasRenderingContext2D | null;
  pctx: CanvasRenderingContext2D | null;
}

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
}: ProcessHandsProps) => {
  const {
    output,
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
    dynamics,
    doesPinchDraw,
    doesWagDelete,
    composite,
    isCapsLock,
    activeLayer,
    straightness,
    isAutoClosed,
    isFill
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
    "ellipses",
    "bitmaps"
  ];

  hands.forEach((hand, handIndex) => {
    const extendedKeyPoints = getExtendedHandPoints(hand.keypoints);
    const wrist = extendedKeyPoints[0];
    const thumbTip = extendedKeyPoints[4];
    const indexTip = extendedKeyPoints[7];
    const middleTip = extendedKeyPoints[12];
    const fallbackDots = [4, 8, 12];
    const dots = scratchPoints?.dots.map(
      (point: number) => extendedKeyPoints[point]
    );
    const centeringContext =
      dots.length > 0
        ? dots
        : fallbackDots.map((point) => extendedKeyPoints[point]);
    const tips = squeezePoints({
      points: dots,
      squeezeRatio,
      centeringContext
    });

    const shapes = shapeNames.reduce<{ [key: string]: IShape[] }>(
      (result, shapeName) => {
        interface SqueezedPoints {
          startPoint: IPoint;
          endPoint: IPoint;
          controlPoint?: IPoint;
        }

        result[shapeName] = scratchPoints[shapeName]
          .map((shape: number[]): IShape | undefined => {
            const points = shape.map(
              (point: number) => extendedKeyPoints[point]
            );
            const squeezedPoints = squeezePoints({
              points,
              squeezeRatio,
              centeringContext
            });

            if (squeezedPoints?.[0] && squeezedPoints[1]) {
              if (
                (shapeName === "curves" || shapeName === "ellipses") &&
                squeezedPoints[2]
              ) {
                return {
                  startPoint: squeezedPoints[0],
                  controlPoint: squeezedPoints[1],
                  endPoint: squeezedPoints[2]
                };
              }
              return {
                startPoint: squeezedPoints[0],
                endPoint: squeezedPoints[1]
              };
            }
            return undefined;
          })
          .filter(
            (shape: IShape | undefined): shape is IShape => shape !== undefined
          );
        return result;
      },
      {}
    );

    if (!thumbTip || !indexTip) return;

    const thumbIndexDistance = getDistance(thumbTip, indexTip);
    const isPinched = thumbIndexDistance < pinchThreshold;
    const isDrawing =
      pressedKey === "Shift" || isCapsLock || (doesPinchDraw && isPinched);
    const isWagging =
      doesWagDelete &&
      (wrist.y - indexTip.y) / (wrist.y - middleTip.y) > 3 &&
      (wrist.y - indexTip.y) / (wrist.x - indexTip.x) > 3;
    const x = (thumbTip.x + indexTip.x) / 2;
    const y = (thumbTip.y + indexTip.y) / 2;

    if (output === "canvas") {
      const ctx = isDrawing ? dctx : pctx;
      if (!ctx) return null;

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

      const styleColor = processColor(
        color as string,
        (isDrawing ? opacity : 255) as number
      );

      if (isFill) {
        ctx.fillStyle = styleColor;
      }
      ctx.strokeStyle = styleColor;
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
          dynamics,
          shapes: shapes as unknown as IShapes,
          handIndex,
          isAutoClosed,
          isFill
        });
        lastTips = tips as IPoint[];
      }

      if (!isScratchCanvas) {
        pinchCanvas({
          radius,
          thumbIndexDistance,
          minimum,
          ctx,
          dynamics,
          x,
          y,
          lastX: lastX || x,
          lastY: lastY || y,
          activeLayer,
          isAutoClosed
        });
      }
    } else {
      setCursor({
        x,
        y,
        lastX,
        lastY,
        isWagging,
        isPinched
      });

      if (usesButtonPinch && thumbIndexDistance < pinchThreshold * 4) {
        checkElementPinch({ x, y, isPinched });
      }

      if (isDrawing) {
        setScribbleNewArea((prevScribbleNewArea: IPoint[]) => {
          const isNewArea =
            prevScribbleNewArea.length === 0 ||
            getDistance(prevScribbleNewArea[prevScribbleNewArea.length - 1], {
              x,
              y
            }) > straightness;

          if (isNewArea) {
            return [...prevScribbleNewArea, { x, y }];
          }
          return prevScribbleNewArea;
        });
      }
    }
    lastX = x;
    lastY = y;
  });
};
