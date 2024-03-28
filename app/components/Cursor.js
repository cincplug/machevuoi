import React from "react";

const Cursor = (props) => {
  const { cursor, hasCursor, isScratchCanvas } = props;
  const { x, y, tips, isPinched, isWagging } = cursor;
  const pinchClass = isPinched ? "active" : "inactive";
  const wagClass = isWagging ? "wagging" : "not-wagging";
  return (
    <>
      {isScratchCanvas &&
        tips?.map((tip, tipIndex) => (
          <div
            className={`cursor fingertip ${wagClass}`}
            key={tipIndex}
            style={{
              left: tip?.x,
              top: tip?.y
            }}
          ></div>
        ))}
      {hasCursor && x > 0 && (
        <div
          className={`cursor ${pinchClass} ${wagClass}`}
          style={{ left: x, top: y }}
        ></div>
      )}
    </>
  );
};

export default Cursor;
