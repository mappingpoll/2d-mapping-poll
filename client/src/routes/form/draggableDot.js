import { DOT_MIN_CLICKABLE_RADIUS } from "./constants";
import style from "./style.css";

export default function DraggableDot(props) {
  //
  const radius = () =>
    props.radius > DOT_MIN_CLICKABLE_RADIUS
      ? props.radius
      : DOT_MIN_CLICKABLE_RADIUS;

  // Drag functionnality
  function handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  }

  function drag({ clientX, clientY }) {
    //if (!dotIsVisible) setDotIsVisible(true);
    // props.isDragging(true);
    let x = clientX + window.pageXOffset;
    let y = clientY + window.pageYOffset;
    props.dispatch({
      type: "MOVE_POINT",
      payload: { id: props.id, position: [x, y] },
    });
  }

  function stopDrag() {
    props.dispatch({ type: "SET_POINTS" });
    document.onmousemove = document.onmouseup = null;
  }
  // Hover hint
  // let [hover, setHover] = useState('')

  return (
    <div
      onMouseDown={handleMouseDown}
      // onmouseEnter={() => setHover(`stroke: ${DOT_COLOR};`)}
      // onmouseOut={() => setHover('')}
      class={style.draggableDot}
      style={{
        width: radius() * 2,
        height: radius() * 2,
        transform: `translate(${props.pos[0]}px, ${props.pos[1]}px) translate(-50%, -50% )`,
      }}
    />
  );
}
