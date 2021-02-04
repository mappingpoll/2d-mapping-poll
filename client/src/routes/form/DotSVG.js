import { DOT_MAX_SIZE, DOT_MIN_SIZE, DOT_MIN_CLICKABLE_RADIUS, DOT_COLOR } from "./constants";

export default function DotSVG(props) {

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
    let x = clientX;
    let y = clientY;
    props.dispatch({type:"MOVE_POINT", payload:{ id: props.id, position: [x, y] }});
  }

  return (
    <>
      {props.visible && <circle
        cx={props.pos[0]}
        cy={props.pos[1]}
        r={props.radius}
        fill={DOT_COLOR}
        opacity={0.2 + DOT_MIN_SIZE / props.radius}
      />}
      {/* transparent click area */}
      <circle
        onPointerDown={handlePointerDown}
        cx={props.pos[0]}
        cy={props.pos[1]}
        r={
          props.radius > DOT_MIN_CLICKABLE_RADIUS
            ? props.radius
            : DOT_MIN_CLICKABLE_RADIUS
        }
        fill="transparent"
        style="cursor: move; pointer-events: initial"
      />
      {/*  */}
    </>
  );
};