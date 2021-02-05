import { DOT_MIN_CLICKABLE_RADIUS } from "./constants";

export function DraggableDot(props) {
  // Drag functionnality
  function handlePointerDown(event) {
    event.stopPropagation();
    repositionDot(event);
    window.addEventListener("pointermove", repositionDot, false);
    function removeListener() {
      window.removeEventListener("pointermove", repositionDot, false);
    }
    window.addEventListener("pointerleave", removeListener, false);
    window.addEventListener("pointercancel", removeListener, false);
    window.addEventListener("pointerup", removeListener, false);
  }

  function repositionDot({ clientX, clientY }) {
    //if (!dotIsVisible) setDotIsVisible(true);
    let x = clientX + window.pageXOffset;
    let y = clientY + window.pageYOffset;
    props.dispatch({
      type: "MOVE_POINT",
      payload: { id: props.id, position: [x, y] },
    });
  }
  return (
    <circle
      onPointerDown={handlePointerDown}
      cx={props.pos[0]}
      cy={props.pos[1]}
      r={
        props.radius > DOT_MIN_CLICKABLE_RADIUS
          ? props.radius
          : DOT_MIN_CLICKABLE_RADIUS
      }
      style="stroke: none; fill: transparent; cursor: move; pointer-events: initial"
    />
  );
}

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
  return <polygon points={points.map((point) => point.join(",")).join(" ")} />;
}
