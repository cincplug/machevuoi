import { MediaPipeHandsMediaPipeModelConfig } from "@tensorflow-models/hand-pose-detection";
import { processHands } from "./processHands";
import { IPoint, ICursor } from "../../types";

interface RunDetectorProps {
  video: HTMLVideoElement;
  setupRef: React.RefObject<any>;
  setCursor: React.Dispatch<React.SetStateAction<ICursor>>;
  setScribbleNewArea: React.Dispatch<React.SetStateAction<IPoint[]>>;
  setMessage: (message: string) => void;
  dctx: CanvasRenderingContext2D | null;
  pctx: CanvasRenderingContext2D | null;
}

export const runDetector = async ({
  video,
  setupRef,
  setCursor,
  setScribbleNewArea,
  setMessage,
  dctx,
  pctx
}: RunDetectorProps) => {
  let shouldContinue = true;
  let handsDetector: any = null;

  const handPoseDetectionModule = await import(
    "@tensorflow-models/hand-pose-detection"
  );
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
    } catch (error) {
      console.error("Error estimating hands", error);
      setMessage("Something's not working 🥸");
      return;
    }

    if (hands?.length && setupRef.current !== null) {
      processHands({
        setup: setupRef.current,
        hands,
        setCursor,
        setScribbleNewArea,
        dctx,
        pctx
      });
    }    

    if (shouldContinue) {
      animationFrameId = requestAnimationFrame(detect);
    }
  };

  animationFrameId = requestAnimationFrame(detect);

  return () => {
    shouldContinue = false;
    cancelAnimationFrame(animationFrameId);
  };
};
