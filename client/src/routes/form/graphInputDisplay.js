import { Dot, Polygon } from "./svgShapes";
import { BLUR_RADIUS, DOT_COLOR, MAX_AREA, MIN_OPACITY } from "./constants";
import { sizeRatio, sizeRatio2Radius } from "./misc";
import style from "./style.css";

function polygonArea(vertices) {
  if (vertices.length < 3) return 0;
  let area = 0;
  let [x0, y0] = vertices[0];
  for (let [x, y] of vertices.slice(1).concat([vertices[0]])) {
    area += x * y0 - y * x0;
    [x0, y0] = [x, y];
  }
  return Math.abs(area); // scaled because way too big otherwise
}

function opacity(n, vertices) {
  // n : 0 -> 100

  let area = polygonArea(vertices);
  if (area > MAX_AREA) area = MAX_AREA;
  return (
    MIN_OPACITY + (1 - MIN_OPACITY) * Math.max(0, n / 100 - area / MAX_AREA)
  );
}

export default function GraphInputDisplay({ points, size }) {
  const ratio = sizeRatio(size);
  const blur = 0.5 * ratio * BLUR_RADIUS;
  const radius = sizeRatio2Radius(ratio);
  const fillShape = points.length > 2;

  let shape = fillShape ? (
    <Polygon points={points} />
  ) : (
    points.map((point, idx) => (
      <Dot key={`point${idx}`} id={idx} pos={point} radius={radius} />
    ))
  );

  return (
    <svg
      class={style.graphInputDisplay}
      style={{
        stroke: DOT_COLOR,
        fill: DOT_COLOR,
        opacity: opacity(size, points),
        strokeWidth: radius * 2,
      }}
    >
      <filter id="blurMe">
        <feGaussianBlur stdDeviation={blur} />
      </filter>
      {shape}
    </svg>
  );
}
