import React, { useState, useEffect, useRef } from "react";

const screenResolution = {
  width: window.innerWidth,
  height: window.innerHeight
};
const { width, height } = screenResolution;
const wallOffset = 50;
const board = {
  left: width / 2 - height / 2 - wallOffset / 2,
  top: wallOffset,
  size: height - wallOffset * 2
};
const speed = 10;

const checkCollision = (ball, pathElement) => {
  let pathLength = pathElement.getTotalLength();
  let precision = 2;
  for (let i = 0; i < pathLength; i += precision) {
    let point = pathElement.getPointAtLength(i);
    let dx = point.x - ball.x;
    let dy = point.y - ball.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ball.radius) {
      let normalAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      return { collision: true, normalAngle: normalAngle };
    }
  }
  return { collision: false };
};

const getBall = (prevState) => {
  const { x, y, angle } = prevState;
  let newX = x + speed * Math.cos((angle * Math.PI) / 180);
  let newY = y + speed * Math.sin((angle * Math.PI) / 180);
  let newAngle = angle;

  let pathElements = document.querySelectorAll(".mask-path");
  let collisionResult = { collision: false };

  pathElements.forEach((pathElement) => {
    let result = checkCollision({ x: newX, y: newY, radius: 20 }, pathElement);
    if (result.collision) {
      collisionResult = result;
    }
  });

  if (collisionResult.collision) {
    newAngle = 2 * collisionResult.normalAngle - angle;
  } else {
    const rectX = board.left;
    const rectY = board.top;
    const rectWidth = board.size;
    const rectHeight = board.size;
    if (newX < rectX || newX > rectX + rectWidth) {
      newAngle = 180 - newAngle;
    }
    if (newY < rectY || newY > rectY + rectHeight) {
      newAngle = 360 - newAngle;
    }
  }

  return {
    x: newX,
    y: newY,
    angle: newAngle
  };
};

const Ball = (props) => {
  const { setup } = props;
  const [ball, setBall] = useState({
    x: width / 2,
    y: height / 2,
    angle: 45
  });

  const rafRef = useRef();

  useEffect(() => {
    const animate = () => {
      setBall((prevState) => getBall(prevState));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  const boardStyleProps = {
    strokeWidth: setup.minimum / 2,
    stroke: setup.color,
    fill: "none"
  };

  return (
    ball.x && (
      <>
        <rect
          x={board.left}
          y={board.top}
          rx={setup.minimum * setup.radius}
          ry={setup.minimum * setup.radius}
          width={board.size}
          height={board.size}
          {...boardStyleProps}
        />
        <circle
          className="mask-path"
          cx={board.left + board.size / 3}
          cy={height / 3}
          r={setup.minimum * setup.radius * 3}
          {...boardStyleProps}
        ></circle>
        <circle
          className="mask-path"
          cx={board.left + (board.size / 3) * 2}
          cy={height / 3}
          r={setup.minimum * setup.radius * 4}
          {...boardStyleProps}
        ></circle>
        <circle
          className="mask-path"
          cx={board.left + board.size / 3}
          cy={(height / 3) * 2}
          r={setup.minimum * setup.radius * 4}
          {...boardStyleProps}
        ></circle>
        <circle
          className="mask-path"
          cx={board.left + (board.size / 3) * 2}
          cy={(height / 3) * 2}
          r={setup.minimum * setup.radius * 3}
          {...boardStyleProps}
        ></circle>
        <circle
          className="ball"
          cx={ball.x}
          cy={ball.y}
          r={setup.minimum}
        ></circle>
      </>
    )
  );
};

export default Ball;
