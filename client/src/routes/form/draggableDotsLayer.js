import { size2Radius } from "./misc";
import DraggableDot from "./draggableDot";
import style from "./style.css";
import { useEffect } from "preact/hooks";

export default function DraggableDotsLayer({ points, size, dispatch }) {
  function handlePointerDown(event) {
    event.stopPropagation();
    const point = [
      event.clientX + window.pageXOffset,
      event.clientY + window.pageYOffset,
    ];
    dispatch({ type: "PLACE_NEW_POINT", payload: point });
  }

  useEffect(() => {});

  return (
    <div
      class={style.draggableDotsLayer}
      onpointerdown={handlePointerDown}
      style={`height: ${document.documentElement.scrollHeight}px`}
    >
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
