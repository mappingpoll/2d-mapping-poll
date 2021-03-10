import { DOT_MIN_CLICKABLE_RADIUS } from "./constants";

export function Dot(props) {
  return (
    <circle
      cx={props.pos[0]}
      cy={props.pos[1]}
      r={props.radius}
      style="stroke: none"
    />
  );
}

export function Stroke({ points }) {
  if (points.length !== 2) throw new RangeError("points.length should equal 2");
  let [x1, y1] = points[0],
    [x2, y2] = points[1];
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
    </>
  );
}

export function Polygon({ points }) {
  if (points.length === 2) return Stroke({ points });
  return <polygon points={points.map(point => point.join(",")).join(" ")} />;
}
