import { processHands } from "./processHands";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setCursor,
  setScribbleNewArea,
  ctx
}) => {
  let frame = 0;
  let shouldContinue = true;
  let animationFrameId;

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

  const detect = async () => {
    const { latency } = setupRef.current;
    if (frame % latency === 0) {
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
          ctx
        });
        points = [...points, ...handPoints];
      }
      if (points.length) {
        setPoints(points);
      }
    }
    frame++;
    if (shouldContinue) {
      animationFrameId = requestAnimationFrame(detect);
    }
  };

  detect();

  return () => {
    shouldContinue = false;
    cancelAnimationFrame(animationFrameId);
  };
};
