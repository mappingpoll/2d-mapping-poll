import { h } from "preact";
import { useLayoutEffect, useReducer, useRef, useState } from "preact/hooks";
import { Text } from "preact-i18n";
import style from "./graph.css";




// magic numbers
const DOT_MAX_SIZE = 220;
const DOT_MIN_SIZE = 2;
const BLUR_RADIUS = 100;
const DOT_COLOR = "red";






const DotSVG = (props) => {
  const { initPos, size } = props;

  let [pos, setPos] = useState(initPos);
  //let [dotSize, setDotSize] = useState(DOT_MIN_SIZE.toString());
  let initX, initY;
  // Drag functionnality
  function handlePointerDown(event) {
    event.stopPropagation();
    const graph = event.target.parentNode;
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
    console.log('circle clicked');
  }

  function repositionDot({clientX, clientY}) {
    //if (!dotIsVisible) setDotIsVisible(true);
    let x = clientX - initX;
    let y = clientY - initY;
    x = rounded(x);
    y = rounded(y);
    setPos([x, y]);
  }


  function rounded(x) {
    return Number.parseInt(x).toString();
  }

  return <circle style="cursor: move;" onPointerDown={handlePointerDown} cx={pos[0]} cy={pos[1]} r={size} fill={DOT_COLOR} />;
};


// reducer to coordinate point positions, sizes, etc
const initialState = {
  points: []
};
const reducer = (state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'RECORD_POINTER_POS':
      // expects payload = [x, y]
      console.log('pointer pos is', payload)
      return Object.assign(state, {pointerPos: payload});
    case 'PLACE_POINT':
      // expects payload = [x, y]
      console.log('placing point')
      const points = [...state.points, state.pointerPos];
      return Object.assign(state, {points})
    case 'repostion': 
      return Object.assign(state, );
    case 'changeSize': return state - 1;
    case 'remove': return 0;
    default: throw new Error('Unexpected action');
  }
};
const action = (type, payload = {}) => ({type, payload});

const Graph = (props) => {
  let initX, initY;

  const [state, dispatch] = useReducer(reducer, initialState);
  let [confidence, setConfidence] = useState("100");

  // ui data
  let [dotSize, setDotSize] = useState(DOT_MIN_SIZE.toString());
  let [blur, setBlur] = useState("0");

  // dom refs
  const g = useRef(null);

  function exposeValues() {
    // props.returnValues({ x: dotXY[0], y: dotXY[1], confidence });
  }

  // useLayoutEffect(exposeValues, [dotXY, confidence]);

  // Drag functionnality
  function handlePointerDown(event) {
    const graph = event.target;
    const rect = graph.getBoundingClientRect();
    initX = rect.left;
    initY = rect.top;
    event.stopPropagation();
    dispatch(action('RECORD_POINTER_POS', [event.clientX - initX, event.clientY - initY]));
    if (state.points.length === 0) dispatch(action('PLACE_POINT'));
    
    // repositionDot(event);
    // graph.addEventListener("pointermove", repositionDot, false);
    // function removeListener() {
    //   graph.removeEventListener("pointermove", repositionDot, false);
    // }
    // graph.addEventListener("pointerleave", removeListener, false);
    // window.addEventListener("pointercancel", removeListener, false);
    // window.addEventListener("pointerup", removeListener, false);
  }
  // function repositionDot(event) {
  //   if (!dotIsVisible) setDotIsVisible(true);
  //   let x = event.clientX - initX;
  //   let y = event.clientY - initY;
  //   x = rounded(x);
  //   y = rounded(y);
  //   setDotXY([x, y]);
  // }
  function handleFuzzyChange(event) {
    setConfidence(event.target.value);
    setBlur(calcBlur());
    setDotSize(rounded((DOT_MAX_SIZE * (DOT_MIN_SIZE + 100 - confidence)) / 100));
  }

  function calcBlur() {
    const radius = (1 - confidence / 100) * BLUR_RADIUS;
    return radius.toString(); //`blur(${radius}px)`;
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
        <div ref={g} class={style.graph}  >
          <svg class={style["graph-svg"]} onPointerDown={handlePointerDown}>
            {state.points?.map((point, i) => <DotSVG key={'point'+i} id={i} initPos={point} size={dotSize}/>)}
          </svg>
        </div>
        <div class={style.labelRight}>{props.labelRight}</div>
      </div>
      <div class={style.labelBottom}>{props.labelBottom}</div>
      <p>
        {/* <Text id="graph.position" fields={{ x: dotXY[0], y: dotXY[1] }}>
          Position: x = {dotXY[0]}, y = {dotXY[1]}
        </Text> */}
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
        onInput={handleFuzzyChange}
      ></input>
    </div>
  );
};

export default Graph;
