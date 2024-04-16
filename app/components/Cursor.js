import React from "react";

const Cursor = (props) => {
  const { cursor, hasCursor } = props;
  const { x, y, isPinched, isWagging } = cursor;
  const pinchClass = isPinched ? "active" : "inactive";
  const wagClass = isWagging ? "wagging" : "not-wagging";
  return (
    hasCursor &&
    x > 0 && (
      <div
        className={`cursor ${pinchClass} ${wagClass}`}
        style={{ left: x, top: y }}
      ></div>
    )
  );
};

export default Cursor;
