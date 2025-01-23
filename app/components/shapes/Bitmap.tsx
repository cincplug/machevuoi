import { getPoint } from "../../utils";
import { IShape } from "../../../types";
import { useState, useEffect } from "react";

interface BitmapProps {
  shape: IShape;
  title: string;
  onClick: () => void;
  isPreview?: boolean;
}

const Bitmap: React.FC<BitmapProps> = ({
  shape: { startPoint, endPoint },
  title,
  onClick,
  isPreview = false
}) => {
  const [imageRatio, setImageRatio] = useState(1);
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const height = Math.hypot(epx - spx, epy - spy);
  const width = height * imageRatio;
  const angle = Math.atan2(epy - spy, epx - spx) - Math.PI / 2;

  const transform = `rotate(${(angle * 180) / Math.PI} ${spx} ${spy})`;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageRatio(img.width / img.height);
    };
    img.src = "/image.png";
  }, []);

  return (
    <g transform={transform}>
      <image
        href="/image.png"
        x={spx - width / 2}
        y={spy}
        width={width}
        height={height}
        className={`scratch-path ${isPreview ? "preview" : ""}`}
      >
        <title>{title}</title>
      </image>
      <polyline
        points={`
          ${spx - width / 2},${spy}
          ${spx + width / 2},${spy}
          ${spx + width / 2},${spy + height}
          ${spx - width / 2},${spy + height}
          ${spx - width / 2},${spy}
        `}
        fill="none"
        className={`scratch-path bitmap-outline ${isPreview ? "preview" : ""}`}
        onClick={onClick}
      />
    </g>
  );
};

export default Bitmap;
