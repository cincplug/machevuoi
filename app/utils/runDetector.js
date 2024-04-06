import { processHands } from "./processHands";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setCursor,
  setScribbleNewArea,
  dctx,
  pctx
}) => {
  let shouldContinue = true;
  let handsDetector = null;

  const handPoseDetectionModule = await import(
    "@tensorflow-models/hand-pose-detection"
  );
  const handsModel = handPoseDetectionModule.SupportedModels.MediaPipeHands;
  const handsDetectorConfig = {
    runtime: "tfjs",
    modelType: "lite"
  };
  handsDetector = await handPoseDetectionModule.createDetector(
    handsModel,
    handsDetectorConfig
  );

  let lastTime = 0;
  const frameRate = 30;
  const targetFrameTime = 1000 / frameRate;
  let animationFrameId;

  const detect = async (timeStamp = 0) => {
    if (timeStamp - lastTime < targetFrameTime) {
      animationFrameId = requestAnimationFrame(detect);
      return;
    }
    lastTime = timeStamp;

    const estimationConfig = { flipHorizontal: true, staticImageMode: false };
    let hands = null;
    try {
      if (handsDetector) {
        hands = await handsDetector.estimateHands(video, estimationConfig);
      }
    } catch (error) {
      console.error("Error estimating hands", error);
      return;
    }

    let points = [];

    if (hands?.length) {
      const handPoints = processHands({
        setupRef,
        hands,
        points,
        setCursor,
        setScribbleNewArea,
        dctx,
        pctx,
      });
      points = [...points, ...handPoints];
    }
    if (points.length) {
      setPoints(points);
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
