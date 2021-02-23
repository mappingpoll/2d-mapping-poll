

// "symetrical" floor fn
export function symFloor(n) {
  return (n / Math.abs(n)) * Math.floor(Math.abs(n));
}