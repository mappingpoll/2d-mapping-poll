import style from "./style.css";

export default function GraphInputLayer({ dispatch }) {
  function handlePointerDown(event) {
    event.stopPropagation();
    const point = [
      event.clientX + window.pageXOffset,
      event.clientY + window.pageYOffset,
    ];
    dispatch({ type: "PLACE_NEW_POINT", payload: point });
  }
  return (
    <div
      class={style.graphInputLayer}
      onpointerdown={handlePointerDown}
      // style={`height: ${document.documentElement.scrollHeight}px`}
    />
  );
}
