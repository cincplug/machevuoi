import React from 'react';
import { IShape } from '../../../types';
import { getPoint } from '../../utils';

interface IProps {
  shape: IShape;
  onClick?: () => void;
  title?: string;
  text?: string;
  isPreview?: boolean;
}

const Text: React.FC<IProps> = ({ shape, onClick, title, text = "", isPreview }) => {
  const { x: spx, y: spy } = getPoint(shape.startPoint, isPreview ?? false);
  const { x: epx, y: epy } = getPoint(shape.endPoint, isPreview ?? false);
  
  // Height is the distance between points
  const height = Math.hypot(epx - spx, epy - spy);
  
  // Calculate angle from top to bottom, add 90 to correct orientation
  const angle = Math.atan2(epy - spy, epx - spx) * 180 / Math.PI - 90;
  
  return (
    <text
      x={spx}
      y={spy}
      fontSize={height}
      textAnchor="middle"
      dominantBaseline="hanging"
      transform={`rotate(${angle}, ${spx}, ${spy})`}
      onClick={onClick}
      className={`scratch-path ${isPreview ? 'preview' : ''}`}
    >
      {title && <title>{title}</title>}
      {text}
    </text>
  );
};

export default Text;