import { h } from "preact";
import { useLayoutEffect, useState } from "preact/hooks";
import { Text } from "preact-i18n";
import style from "./graph.css";

const Graph = (props) => {
  let initX, initY;

  const DOT_BASE_SIZE = 100;
  // the data we want
  let [dotXY, setDotXY] = useState([0, 0]);
  let [confidence, setConfidence] = useState(100);
  // ui data
  let [dotSize, setDotSize] = useState(2);
  let [dotIsVisible, setDotIsVisible] = useState(false);

  function exposeValues() {
    props.returnValues({x: dotXY[0], y: dotXY[1], confidence})
  }

  useLayoutEffect(exposeValues, [dotXY, confidence])  

  // Drag functionnality
  function handlePointerDown(event) {
    const graph = event.target;
    const rect = graph.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;
    repositionDot(event)
    graph.addEventListener("pointermove", repositionDot, false);
    function removeListener() {
      graph.removeEventListener("pointermove", repositionDot, false);
    }
    graph.addEventListener("pointerleave", removeListener, false);
    window.addEventListener("pointercancel", removeListener, false);
    window.addEventListener("pointerup", removeListener, false);
  }

  function repositionDot(event) {
    if (!dotIsVisible) setDotIsVisible(true);
    let x = event.clientX - initX;
    let y = event.clientY - initY;
    x = singleDecimal(x);
    y = singleDecimal(y);
    setDotXY([x, y]);
  }

  function resizeDot(event) {
    setConfidence(event.target.value)
    setDotSize(singleDecimal(DOT_BASE_SIZE * (102 - confidence) / 100));
  }

  function singleDecimal(x) {
    return Number.parseFloat(x).toFixed(1);
  }

  return (
    <div class={style.graphContainer}>
      <p class={style.labelTop}>{props.labelTop}</p>
      <div class={style.graphBox}>
        <div class={style.labelLeft}>{props.labelLeft}</div>
        <div class={style.graph} onPointerDown={handlePointerDown}>
          {dotIsVisible && <div
            class={style.dot}
            style={{
              top: dotXY[1] - dotSize + "px",
              left: dotXY[0] - dotSize + "px",
              filter: `blur(calc(${1 - confidence / 100} * var(--fuzz-radius))`,
              borderWidth: dotSize + "px",
            }}
          />}
        </div>
        <p class={style.labelRight}>{props.labelRight}</p>
      </div>
      <p class={style.labelBottom}>{props.labelBottom}</p>
      <p>
        <Text id="graph.position" fields={{ x: dotXY[0], y: dotXY[1] }}>
          Position: x = {dotXY[0]}, y = {dotXY[1]}
        </Text>
      </p>

      <label for="fuzzy">
        <Text id="graph.fuzzy">Precision: </Text>
      </label>
      <input
        type="range"
        id="fuzzy"
        name="fuzzy"
        min="1"
        value={confidence}
        onInput={resizeDot}
      ></input>
    </div>
  );
};

export default Graph;
