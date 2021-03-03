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

export function rangeDiscreet(range) {
  const min = Math.min(...range),
    max = Math.max(...range);
  return new Array(max - min + 1).fill(0).map((_, i) => i + min);
}

export function clamp(n, min, max) {
  if (min > max) min = max;
  if (max < min) max = min;
  return n <= min ? min : n >= max ? max : n;
}
