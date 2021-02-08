import { h } from "preact";
import { useLayoutEffect, useReducer, useState } from "preact/hooks";
import { MarkupText, Text } from "preact-i18n";
import style from "./graph.css";
import { reducer, action } from "./reducer";

// magic numbers
import { GRAPH_HEIGHT, GRAPH_WIDTH, MAX_N_POINTS } from "./constants";
import SVGOverlay from "./SVGOverlay";

// reducer to coordinate point positions, sizes, etc
const initialPoints = [];

const Graph = (props) => {
  const [points, dispatch] = useReducer(reducer, initialPoints);
  // window.onresize = () => dispatch(action("OFFSET_POINTS", [window.innerWidth, window.innerHeight]))
  // user interaction
  function handlePointerDown(event) {
    event.stopPropagation();
    const point = [
      event.clientX + window.pageXOffset,
      event.clientY + window.pageYOffset,
    ];
    if (points.length < MAX_N_POINTS)
      dispatch(action("PLACE_NEW_POINT", point));
  }

  // buttons & knobs

  let [showHelp, setShowHelp] = useState(false),
    //[isConnected, setIsConnected] = useState(false),
    [confidence, setConfidence] = useState(100),
    [importance, setImportance] = useState(100);

  useLayoutEffect(() => props.report({ points, confidence, importance }));

  //svg
  const svg = (
    <SVGOverlay
      points={points}
      size={confidence}
      //fillShape={isConnected}
      dispatch={dispatch}
    />
  );

  // jsx
  return (
    <div class={style.graphContainer}>
      <div class={style.help}>
        <button type="button" onClick={() => setShowHelp(!showHelp)}>
          Help
        </button>
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
        <div
          class={style.graph}
          style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}
          onPointerDown={handlePointerDown}
        />
        <div class={style.labelLeftRight}>{props.labelRight}</div>
      </div>
      <div class={style.labelTopBottom}>{props.labelBottom}</div>
      {/* <p>
        <Text id="graph.position" fields={{ x: dotXY[0], y: dotXY[1] }}>
          Position: x = {dotXY[0]}, y = {dotXY[1]}
        </Text>
      </p> */}

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
          onInput={(e) => setConfidence(e.target.value)}
        />
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
          onInput={(e) => setImportance(e.target.value)}
        />
        <label for="fuzzy">
          <Text id="graph.importanceslider.after">
            This is crucially important to me
          </Text>
        </label>
      </div>
      {/* <div class={style.checkbox}>
        <input
          type="checkbox"
          id="connect"
          name="connected"
          disabled={points.length < 2}
          checked={isConnected}
          onChange={() => setIsConnected(!isConnected)}
        />
        <label for="connect">
          <Text id="graph.connectcheckbox">Connect the dots?</Text>
        </label>
      </div> */}
      {/* <button
        type="button"
        disabled={points.length === 0}
        onClick={() => dispatch({ type: "REMOVE_POINT" })}
      >
        <Text id="graph.removepoint">Remove a point</Text>
      </button> */}
      <button
        type="button"
        disabled={points.length === 0}
        onClick={() => dispatch({ type: "REMOVE_ALL_POINTS" })}
      >
        <Text id="graph.removeallpoint">Reset</Text>
      </button>
      {svg}
    </div>
  );
};

export default Graph;
