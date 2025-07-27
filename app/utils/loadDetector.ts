let cachedDetector: any = null;

export async function initializeDetector() {
  if (cachedDetector) return cachedDetector;

  try {
    const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Create a wrapper that matches the expected API
    const detector = {
      estimateHands: async (video: HTMLVideoElement, config: any) => {
        return new Promise((resolve) => {
          const timestamp = performance.now();
          
          const results = handLandmarker.detectForVideo(video, timestamp);
          
          if (results.landmarks && results.landmarks.length > 0) {
            const hands = results.landmarks.map((landmarks: any, index: number) => {
              const keypoints = landmarks.map((landmark: any, i: number) => ({
                // Flip the x coordinate horizontally to match the flipped video
                x: (1 - landmark.x) * video.videoWidth,
                y: landmark.y * video.videoHeight,
                name: `landmark_${i}`
              }));

              return {
                score: 0.9, // Hand Landmarker doesn't provide individual hand scores in this format
                handedness: results.handedness?.[index]?.[0]?.displayName || "Right",
                keypoints,
                keypoints3D: landmarks.map((landmark: any, i: number) => ({
                  // Flip the x coordinate horizontally to match the flipped video
                  x: (1 - landmark.x) * video.videoWidth,
                  y: landmark.y * video.videoHeight,
                  z: landmark.z,
                  name: `landmark_${i}`
                }))
              };
            });
            resolve(hands);
          } else {
            resolve([]);
          }
        });
      }
    };

    cachedDetector = detector;
    return detector;
  } catch (error) {
    console.error("Failed to initialize Hand Landmarker:", error);
    throw new Error("Failed to initialize hand detection");
  }
}
