export const processFaces = ({ faces, setCursor }) => {
  let newPoints = [];
  faces.forEach((face) => {
    if (face.keypoints) {
      newPoints = newPoints.concat(face.keypoints);
    }
  });
  const foreheadTop = faces[0]?.keypoints[10];
  const eyebrowMid = faces[0]?.keypoints[8];
  const noseRoot = faces[0]?.keypoints[168];
  const muzzle = faces[0]?.keypoints[151];
  const surpriseThreshold = 0.17;
  setCursor((prevCursor) => {
    return {
      ...prevCursor,
      muzzle:
        (noseRoot.y - eyebrowMid.y) / (noseRoot.y - foreheadTop.y) >
        surpriseThreshold
          ? muzzle
          : null
    };
  });
  return newPoints;
};
