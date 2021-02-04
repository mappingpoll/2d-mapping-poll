import { h } from "preact";
import { useLayoutEffect, useReducer, useRef, useState } from "preact/hooks";
import { MarkupText, Text } from "preact-i18n";
import style from "./graph.css";

// magic numbers
const DOT_MAX_SIZE = 220;
const DOT_MIN_SIZE = 2;
const DOT_MIN_CLICKABLE_RADIUS = 30;
const BLUR_RADIUS = 100;
const DOT_COLOR = "black";
const MAX_N_POINTS = 100;

const DotSVG = (props) => {
  let initX, initY;
  // Drag functionnality
  function handlePointerDown(event) {
    event.stopPropagation();
    const graph = event.target.parentNode;
    const rect = graph.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;
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
    props.dispatch(action("MOVE_POINT", { id: props.id, position: [x, y] }));
  }

  function rounded(x) {
    return Number.parseInt(x).toString();
  }

  return (
    <>
      <circle
        cx={props.pos[0]}
        cy={props.pos[1]}
        r={props.radius}
        fill={DOT_COLOR}
        opacity={0.2 + DOT_MIN_SIZE / props.radius}
      />
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

// reducer to coordinate point positions, sizes, etc
const initialPoints = [];
const reducer = (points, action) => {
  const { type, payload } = action;
  switch (type) {
    case "PLACE_NEW_POINT":
      // expected payload: [x, y]
      return [...points, payload];
    case "MOVE_POINT":
      // expected payload: { id, position }
      const newPoints = [...points];
      newPoints[payload.id] = payload.position;
      return newPoints;
    case "REMOVE_POINT":
      return [...points].slice(0, -1);
    case "REMOVE_ALL_POINTS":
      return [];
    default:
      throw new Error("Unexpected action");
  }
};
const action = (type, payload = {}) => ({ type, payload });

const Graph = (props) => {
  let initX, initY;

  const [points, dispatch] = useReducer(reducer, initialPoints);

  function exposeValues() {
    // props.returnValues({ x: dotXY[0], y: dotXY[1], confidence });
  }

  // user interaction
  function handlePointerDown(event) {
    const graph = event.target;
    const rect = graph.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;
    event.stopPropagation();
    const point = [event.clientX, event.clientY];
    if (points.length < MAX_N_POINTS)
      dispatch(action("PLACE_NEW_POINT", point));
  }

  // buttons & knobs
  let [isConnected, setIsConnected] = useState(false);
  function handleConnectedChange(event) {
    event.preventDefault();
    setIsConnected(!isConnected);
  }

  let [confidence, setConfidence] = useState(100);
  let [blur, setBlur] = useState(0);
  let [dotSize, setDotSize] = useState(DOT_MIN_SIZE);

  function handleFuzzyChange(event) {
    const c = parseInt(event.target.value),
      b = (1 - c / 100) * BLUR_RADIUS,
      s = DOT_MIN_SIZE + (1 - c / 100) * DOT_MAX_SIZE;
    setConfidence(c);
    setBlur(b);
    setDotSize(Math.round(s));
  }

  let [importance, setImportance] = useState(100);
  function handleImportanceChange(event) {
    setImportance(event.target.value);
  }

  function removePoint(event) {
    event.preventDefault();
    dispatch(action("REMOVE_POINT"));
  }

  function removeAllPoints(event) {
    event.preventDefault();
    dispatch(action("REMOVE_ALL_POINTS"));
  }

  let [showHelp, setShowHelp] = useState(false);
  function toggleHelp(event) {
    event.preventDefault();
    setShowHelp(!showHelp);
  }

  //svg
  const svgContent = points.map((point, idx) => {
    return (
      <DotSVG
        key={"point" + idx}
        id={idx}
        pos={point}
        radius={dotSize}
        dispatch={dispatch} />
    );
  })


  // jsx
  return (
    <div class={style.graphContainer}>
      <div class={style.help}>
        <button onClick={toggleHelp}>Help</button>
        {showHelp && (
          <MarkupText id="graph.instructions">
            <ol>
              <li>
                Indicate your position by placing a dot at the X and Y
                coordinates that best represent your position.
              </li>
              <li>
                If a single point does not suffice, you may add one or more
                additional points to nuance your stance. Clicking/Touching a
                blank area.
              </li>
              <li>
                Use the sliders below the graph to qualify your answer further.
              </li>
            </ol>
          </MarkupText>
        )}{" "}
      </div>
      <div class={style.labelTopBottom}>{props.labelTop}</div>
      <div class={style["vertical-center"]}>
        <div class={style.labelLeftRight}>{props.labelLeft}</div>
        <div class={style.graph} onPointerDown={handlePointerDown}></div>
        <div class={style.labelLeftRight}>{props.labelRight}</div>
      </div>
      <div class={style.labelTopBottom}>{props.labelBottom}</div>
      {/* <p>
        <Text id="graph.position" fields={{ x: dotXY[0], y: dotXY[1] }}>
          Position: x = {dotXY[0]}, y = {dotXY[1]}
        </Text>
      </p> */}
      <div class={style.checkbox}>
        <input type="checkbox" id="connect" name="connected" checked={isConnected} onChange={handleConnectedChange} />
        <label for="connect"><Text id="graph.connectcheckbox">Connect the dots?</Text></label>
      </div>
      <div class={style.slider}>
        <label for="fuzzy">
          <Text id="graph.fuzzyslider.before">
            My position is very uncertain
          </Text>
        </label>
        <input
          type="range"
          id="fuzzy"
          name="fuzzy"
          min="1"
          value={confidence.toString()}
          onInput={handleFuzzyChange}
        ></input>
        <label for="fuzzy">
          <Text id="graph.fuzzyslider.after">
            My position is clear and precise
          </Text>
        </label>
      </div>
      <div class={style.slider}>
        <label for="importance">
          <Text id="graph.importanceslider.before">
            I couldn't care less about this
          </Text>
        </label>
        <input
          type="range"
          id="importance"
          name="importance"
          min="1"
          value={importance.toString()}
          onInput={handleImportanceChange}
        ></input>
        <label for="fuzzy">
          <Text id="graph.importanceslider.after">
            This is crucially important to me
          </Text>
        </label>
      </div>
      <button disabled={points.length === 0} onClick={removePoint}>
        <Text id="graph.removepoint">Remove a point</Text>
      </button>
      <button disabled={points.length === 0} onClick={removeAllPoints}>
        <Text id="graph.removeallpoint">Remove all points</Text>
      </button>
      {/* svg display */}
      <svg class={style["graph-svg"]}>
        <filter id="blurMe">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
        {svgContent}
      </svg>
    </div>
  );
};

export default Graph;
