import { DOT_MIN_CLICKABLE_RADIUS } from "./constants";
import style from "./style.css";

export default function DraggableDot(props) {
  //
  const radius = () =>
    props.radius > DOT_MIN_CLICKABLE_RADIUS
      ? props.radius
      : DOT_MIN_CLICKABLE_RADIUS;

  // Drag functionnality
  function handlePointerDown(event) {
    event.stopPropagation();
    repositionDot(event);
    window.onpointermove = repositionDot;
    function removeListener() {
      props?.dispatch({ type: "SET_POINTS" });
      window.onpointermove = window.onpointerleave = window.onpointercancel = window.onpointerup = null;
    }
    window.onpointerleave = removeListener;
    window.onpointercancel = removeListener;
    window.onpointerup = removeListener;
  }

  function repositionDot({ clientX, clientY }) {
    //if (!dotIsVisible) setDotIsVisible(true);
    // props.isDragging(true);
    let x = clientX + window.pageXOffset;
    let y = clientY + window.pageYOffset;
    props.dispatch({
      type: "MOVE_POINT",
      payload: { id: props.id, position: [x, y] },
    });
  }

  // Hover hint
  // let [hover, setHover] = useState('')

  return (
    <div
      onpointerdown={handlePointerDown}
      // onPointerEnter={() => setHover(`stroke: ${DOT_COLOR};`)}
      // onPointerOut={() => setHover('')}
      class={style.draggableDot}
      style={{
        width: radius() * 2,
        height: radius() * 2,
        transform: `translate(${props.pos[0]}px, ${props.pos[1]}px) translate(-50%, -50% )`,
      }}
    />
  );
}
