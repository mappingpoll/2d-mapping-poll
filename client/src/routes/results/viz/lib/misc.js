export const isChosenAxis = a => a != "";

export const hasXAxis = ({ x }) => isChosenAxis(x);

export const hasXYAxes = ({ x, y }) => isChosenAxis(x) && isChosenAxis(y);

export const hasThreeAxes = ({ x, y, z }) =>
  isChosenAxis(x) && isChosenAxis(y) && isChosenAxis(z);

export const canShowCustomViz = axes => hasXYAxes(axes);

// "symetrical" floor fn
export function symFloor(n) {
  return (n / Math.abs(n)) * Math.floor(Math.abs(n));
}
