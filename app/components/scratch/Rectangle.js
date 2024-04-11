import HP from "../../data/handPoints.json";

const Rectangle = ({ shape, onClick, isPreview = false }) => {
    const [startPoint, endPoint] = shape;
    const spx = HP[startPoint].x;
    const spy = HP[startPoint].y;
    const epx = isPreview ? endPoint.x : HP[endPoint].x;
    const epy = isPreview ? endPoint.y : HP[endPoint].y;
  
    const cpx = spx;
    const cpy = epy;
    const dpx = epx;
    const dpy = spy;
  
    return (
      <polygon
        points={`${spx},${spy} ${cpx},${cpy} ${epx},${epy} ${dpx},${dpy}`}
        className={`scratch-path ${isPreview ? "preview" : ""}`}
        onClick={onClick}
      />
    );
  };
  
  export default Rectangle;
  
