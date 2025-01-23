import { getPoint } from "../../utils";
import { IShape } from "../../../types";

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
  const { x: spx, y: spy } = getPoint(startPoint, isPreview);
  const { x: epx, y: epy } = getPoint(endPoint, isPreview);

  const height = Math.hypot(epx - spx, epy - spy);
  const width = height * (16 / 9);
  const angle = Math.atan2(epy - spy, epx - spx) - Math.PI / 2;

  return (
    <image
      href="/image.png"
      x={spx - width / 2}
      y={spy}
      width={width}
      height={height}
      className={`scratch-path ${isPreview ? "preview" : ""}`}
      onClick={onClick}
      transform={`rotate(${(angle * 180) / Math.PI} ${spx} ${spy})`}
    >
      <title>{title}</title>
    </image>
  );
};

export default Bitmap;
