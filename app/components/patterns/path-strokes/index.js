const pathStrokes = (props) => {
  const { pathStroke, thisPoint, controlPoint, prevPoint, nextPoint, radius, growth } =
    props;
  const strokeDefinitions = {
    lines: `L${thisPoint.x} ${thisPoint.y} `,
    arcs: `A${radius * growth} ${radius * growth} 0 0 1 ${thisPoint.x} ${
      thisPoint.y
    }`,
    quadratics: `Q${controlPoint.x} ${controlPoint.y} ${thisPoint.x} ${thisPoint.y}`,
    beziers: `C ${thisPoint.x} ${thisPoint.y}, ${thisPoint.x} ${thisPoint.y}, ${
      (thisPoint.x + nextPoint.x) / 2
    } ${(thisPoint.y + nextPoint.y) / 2}`,
    bezinerves: `C ${thisPoint.x} ${thisPoint.y}, ${thisPoint.x} ${thisPoint.y}, ${
      (thisPoint.x + prevPoint.x) / 2
    } ${(thisPoint.y + prevPoint.y) / 2}`,
    watermelons: `L${controlPoint.x} ${controlPoint.y} A${radius * growth} ${
      radius * growth
    } 1 0 1 ${thisPoint.x} ${thisPoint.y} Z`
  };
  return strokeDefinitions[pathStroke];
};

export default pathStrokes;
