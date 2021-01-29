import { h } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { Text } from "preact-i18n";
import style from "./graph.css";

const DotSVG = (props) => {
  const { top, left, size } = props;
  const COLOR = "red";
  return <circle cx={left} cy={top} r={size} fill={COLOR} />;
};

const Graph = (props) => {
  let initX, initY;

  const DOT_MAX_SIZE = 220;
  const DOT_MIN_SIZE = 2;
  const BLUR_RADIUS = 100;
  // the data we want
  let [dots, setDots] = useState([]);
  let [dotXY, setDotXY] = useState(["0", "0"]);
  let [confidence, setConfidence] = useState("100");
  // ui data
  let [dotSize, setDotSize] = useState(DOT_MIN_SIZE.toString());
  let [dotIsVisible, setDotIsVisible] = useState(false);
  let [blur, setBlur] = useState("none");

  // dom refs
  const g = useRef(null);

  function exposeValues() {
    props.returnValues({ x: dotXY[0], y: dotXY[1], confidence });
  }

  useLayoutEffect(exposeValues, [dotXY, confidence]);

  // Drag functionnality
  function handlePointerDown(event) {
    const graph = event.target;
    const rect = graph.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;
    repositionDot(event);
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
    x = rounded(x);
    y = rounded(y);
    setDotXY([x, y]);
  }
  function calcBlur() {
    const radius = (1 - confidence / 100) * BLUR_RADIUS;
    return radius.toString(); //`blur(${radius}px)`;
  }
  function resizeDot(event) {
    setConfidence(event.target.value);
    setBlur(calcBlur());
    setDotSize(rounded((DOT_MAX_SIZE * (102 - confidence)) / 100));
  }

  function rounded(x) {
    return Number.parseInt(x).toString();
  }

  return (
    <div class={style.graphContainer}>
      <svg>
        <defs>
          <filter id="blurMe">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
      </svg>
      <div class={style.labelTop}>{props.labelTop}</div>
      <div class={style["vertical-center"]}>
        <div class={style.labelLeft}>{props.labelLeft}</div>
        <div ref={g} class={style.graph} onPointerDown={handlePointerDown}>
          <svg
            class={style["graph-svg"]}
            
          >
            ({dotIsVisible} &&{" "}
            <DotSVG top={dotXY[1]} left={dotXY[0]} size={dotSize} />)
          </svg>
        </div>
        <div class={style.labelRight}>{props.labelRight}</div>
      </div>
      <div class={style.labelBottom}>{props.labelBottom}</div>
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
