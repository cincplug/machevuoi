import { processFaces } from "./processFaces";
import { processHands } from "./processHands";

export const runDetector = async ({
  video,
  setupRef,
  setPoints,
  setCustomMask,
  setCustomMaskNewArea,
  setCursor,
  setHandsCount,
  setScribbleNewArea,
  ctx
}) => {
  let frame = 0;
  let shouldContinue = true;
  let animationFrameId;

  let facesDetector = null;
  let handsDetector = null;

  if (setupRef.current.showsFaces) {
    const faceLandmarksDetectionModule = await import("@tensorflow-models/face-landmarks-detection");
    const facesModel = faceLandmarksDetectionModule.SupportedModels.MediaPipeFaceMesh;
    const facesDetectorConfig = {
      runtime: "tfjs",
      refineLandmarks: false
    };
    facesDetector = await faceLandmarksDetectionModule.createDetector(
      facesModel,
      facesDetectorConfig
    );
  }

  if (setupRef.current.showsHands) {
    const handPoseDetectionModule = await import("@tensorflow-models/hand-pose-detection");
    const handsModel = handPoseDetectionModule.SupportedModels.MediaPipeHands;
    const handsDetectorConfig = {
      runtime: "tfjs",
      modelType: "lite"
    };
    handsDetector = await handPoseDetectionModule.createDetector(
      handsModel,
      handsDetectorConfig
    );
  }

  const detect = async () => {
    const { showsFaces, showsHands, latency } = setupRef.current;
    if (frame % latency === 0) {
      const estimationConfig = { flipHorizontal: true, staticImageMode: false };
      let faces = null;
      let hands = null;
      try {
        if (showsFaces && facesDetector) {
          faces = await facesDetector.estimateFaces(video, estimationConfig);
        }
        if (showsHands && handsDetector) {
          hands = await handsDetector.estimateHands(video, estimationConfig);
        }
      } catch (error) {
        console.error("Error estimating faces or hands", error);
        return;
      }

      let points = [];

      if (showsFaces && faces?.length) {
        const facePoints = processFaces({
          faces,
          setCursor
        });
        points = [...points, ...facePoints];
      }

      if (showsHands && hands?.length) {
        const handPoints = processHands({
          setupRef,
          hands,
          points,
          setCursor,
          setCustomMaskNewArea,
          setCustomMask,
          setScribbleNewArea,
          ctx
        });
        points = [...points, ...handPoints];
      }
      setHandsCount(hands ? hands.length : 0);
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
