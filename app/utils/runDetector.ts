import {
  MediaPipeHandsMediaPipeModelConfig,
  HandDetector
} from "@tensorflow-models/hand-pose-detection";
import { processHands } from "./processHands";
import { IPoint, ICursor } from "../../types";
import { OscillatorManager } from "./audio";
import { getExtendedHandPoints } from "./index";

interface RunDetectorProps {
  video: HTMLVideoElement;
  setupRef: React.RefObject<any>;
  setCursor: React.Dispatch<React.SetStateAction<ICursor>>;
  setScribbleNewArea: React.Dispatch<React.SetStateAction<IPoint[]>>;
  setIsDetectorRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: (message: string) => void;
  dctx: CanvasRenderingContext2D | null;
  pctx: CanvasRenderingContext2D | null;
}

export const runDetector = async ({
  video,
  setupRef,
  setCursor,
  setScribbleNewArea,
  setIsDetectorRunning,
  setMessage,
  dctx,
  pctx
}: RunDetectorProps) => {
  let shouldContinue = true;
  const handPoseDetectionModule = await import(
    "@tensorflow-models/hand-pose-detection"
  );
  let handsDetector: HandDetector | null = null;
  const handsModel = handPoseDetectionModule.SupportedModels.MediaPipeHands;

  const handsDetectorConfig: MediaPipeHandsMediaPipeModelConfig = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
  };

  try {
    handsDetector = await handPoseDetectionModule.createDetector(
      handsModel,
      handsDetectorConfig
    );
  } catch (error) {
    console.error("Error creating detector", error);
    setMessage(
      "Something's wrong with fetching data. It's not us, it's them 🥸"
    );
    return;
  }

  let lastTime = 0;
  const frameRate = 30;
  const targetFrameTime = 1000 / frameRate;
  let animationFrameId: number;

  const oscillatorManager = new OscillatorManager(setupRef.current);

  const detect = async (timeStamp: number = 0) => {
    if (timeStamp - lastTime < targetFrameTime) {
      animationFrameId = requestAnimationFrame(detect);
      return;
    }
    lastTime = timeStamp;

    const estimationConfig = { flipHorizontal: true, staticImageMode: false };
    let hands: any = null;
    try {
      if (handsDetector) {
        hands = await handsDetector.estimateHands(video, estimationConfig);
      }
      setIsDetectorRunning(true);
    } catch (error) {
      console.error("Error estimating hands", error);
      setMessage("Something's not working 🥸");
      return;
    }

    if (hands?.length && setupRef.current !== null) {
      hands.forEach((hand: any, handIndex: number) => {
        const points = getExtendedHandPoints(hand.keypoints);
        const thumbTip = points[4];
        const indexTip = points[7];

        if (thumbTip && indexTip) {
          const x = (thumbTip.x + indexTip.x) / 2;
          const y = (thumbTip.y + indexTip.y) / 2;

          if (setupRef.current.hasSound) {
            oscillatorManager.updateOscillator(
              handIndex,
              x,
              y,
              video.width,
              video.height
            );
          }
        }
      });

      processHands({
        setup: setupRef.current,
        hands,
        setCursor,
        setScribbleNewArea,
        dctx,
        pctx
      });
    }

    if (Array.isArray(hands) && hands.length === 0) {
      pctx?.clearRect(0, 0, pctx.canvas.width, pctx.canvas.height);
    }

    if (shouldContinue) {
      animationFrameId = requestAnimationFrame(detect);
    }
  };

  animationFrameId = requestAnimationFrame(detect);

  return () => {
    shouldContinue = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    oscillatorManager?.cleanup();
  };
};
