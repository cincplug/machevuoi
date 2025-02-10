let cachedDetector: any = null;

export async function initializeTensorFlow() {
  if (cachedDetector) return cachedDetector;

  try {
    await import("@tensorflow/tfjs-backend-webgl");
    const handPoseDetectionModule = await import(
      "@tensorflow-models/hand-pose-detection"
    );

    const detector = await handPoseDetectionModule.createDetector(
      handPoseDetectionModule.SupportedModels.MediaPipeHands,
      {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands"
      }
    );

    cachedDetector = detector;
    return detector;
  } catch (error) {
    console.error("Failed to initialize TensorFlow:", error);
    throw new Error("Failed to initialize hand detection");
  }
}
