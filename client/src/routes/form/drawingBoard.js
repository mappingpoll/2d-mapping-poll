import style from './graph.css'
import { Dot, DraggableDot, Polygon } from "./shapes";
import {
  DOT_MAX_RADIUS,
  DOT_MIN_RADIUS,
  BLUR_RADIUS,
  DOT_COLOR,
} from "./constants";

export default function SVGOverlay({points,  size, fillShape, dispatch}) {


  const invRatio = () => 1 - size / 100;
  const blur = () => 0.5 * invRatio() * BLUR_RADIUS;
  const radius = () => DOT_MIN_RADIUS + invRatio() * DOT_MAX_RADIUS;
  const opacity = () => 0.2 + size / 100;


  let draggable = points.map((point, idx) => (
    <DraggableDot
      key={`point${idx}`}
      id={idx}
      pos={point}
      radius={radius()}
      dispatch={dispatch}
    />
  ));

  let shape = fillShape ? (
    <Polygon points={points} />
  ) : (
    points.map((point, idx) => (
      <Dot key={`point${idx}`} id={idx} pos={point} radius={radius()} />
    ))
  );

  return (
    <svg
      class={style["graph-svg"]}
      style={{
        stroke: DOT_COLOR,
        fill: DOT_COLOR,
        opacity: opacity(),
        strokeWidth: radius() * 2,
      }}
    >
      <filter id="blurMe">
        <feGaussianBlur stdDeviation={blur()} />
      </filter>
      {shape}
      {draggable}
    </svg>
  );
}
