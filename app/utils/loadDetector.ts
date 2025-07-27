let cachedDetector: any = null;

export async function initializeDetector() {
  if (cachedDetector) return cachedDetector;

  try {
    const { Hands } = await import("@mediapipe/hands");

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    const detector = {
      estimateHands: async (video: HTMLVideoElement, config: any) => {
        return new Promise((resolve) => {
          const handleResults = (results: any) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              const hands = results.multiHandLandmarks.map((landmarks: any, index: number) => {
                const keypoints = landmarks.map((landmark: any, i: number) => ({
                  // Flip the x coordinate horizontally to match the flipped video
                  x: (1 - landmark.x) * video.videoWidth,
                  y: landmark.y * video.videoHeight,
                  name: `landmark_${i}`
                }));

                return {
                  score: 0.9, // MediaPipe doesn't provide individual hand scores
                  handedness: results.multiHandedness?.[index]?.label || "Right",
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
          };

          // Set up the results handler
          hands.onResults(handleResults);
          
          // Process the video frame
          hands.send({ image: video });
        });
      }
    };

    cachedDetector = detector;
    return detector;
  } catch (error) {
    console.error("Failed to initialize MediaPipe:", error);
    throw new Error("Failed to initialize hand detection");
  }
}
