import { size2Radius } from "./misc";
import DraggableDot from "./draggableDot";
import style from "./style.css";

export default function GraphInputLayer({ points, size, dispatch }) {
  function handlePointerDown(event) {
    event.stopPropagation();
    const point = [
      event.clientX + window.pageXOffset,
      event.clientY + window.pageYOffset,
    ];
    dispatch({ type: "PLACE_NEW_POINT", payload: point });
  }
  return (
    <div class={style.graphInputLayer} onpointerdown={handlePointerDown}>
      {points.map((point, idx) => (
        <DraggableDot
          key={`point${idx}`}
          id={idx}
          pos={point}
          radius={size2Radius(size)}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
}
