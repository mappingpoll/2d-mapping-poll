import { h } from "preact";
import { useState } from "preact/hooks";
import { Text } from "preact-i18n";
import style from "./graph.css";

const Graph = (props) => {
  let initX, initY;

  const DOT_BASE_SIZE = 100;

  let [dotXY, setDotXY] = useState([0, 0]);
  let [fuzziness, setFuzziness] = useState(100);
  let [size, setSize] = useState(5);
  let [dotSize, setDotSize] = useState((DOT_BASE_SIZE * size) / 100);

  // Drag functionnality
  function handleMouseDown(event) {
    const graph = event.target;
    const rect = graph.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;
    repositionDot(event)
    graph.addEventListener("mousemove", repositionDot, false);
    function removeListener() {
      graph.removeEventListener("mousemove", repositionDot, false);
    }
    graph.addEventListener("mouseleave", removeListener, false);
    window.addEventListener("mouseup", removeListener, false);
  }

  function repositionDot(event) {
    let x = event.clientX - initX;
    let y = event.clientY - initY;
    setDotXY([x, y]);
  }

  function resizeDot(event) {
    setSize(event.target.value);
    setDotSize((DOT_BASE_SIZE * size) / 100);
  }

  return (
    <div class={style.graphContainer}>
      <p class={style.labelTop}>{props.labelTop}</p>
      <div class={style.graphBox}>
        <div class={style.labelLeft}>{props.labelLeft}</div>
        <div class={style.graph} onMouseDown={handleMouseDown}>
          <div
            class={style.dot}
            style={{
              top: dotXY[1] - dotSize + "px",
              left: dotXY[0] - dotSize + "px",
              filter: `blur(calc(${1 - fuzziness / 100} * var(--fuzz-radius))`,
              borderWidth: dotSize + "px",
            }}
          ></div>
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
        <Text id="graph.fuzzy">Confidence</Text>
      </label>
      <input
        type="range"
        id="fuzzy"
        name="fuzzy"
        value={fuzziness}
        onInput={(e) => setFuzziness(e.target.value)}
      ></input>
      <label for="size">
        <Text id="graph.size">Size</Text>
      </label>
      <input
        type="range"
        id="size"
        name="size"
        min="1"
        value={size}
        onInput={resizeDot}
      ></input>
    </div>
  );
};

export default Graph;
