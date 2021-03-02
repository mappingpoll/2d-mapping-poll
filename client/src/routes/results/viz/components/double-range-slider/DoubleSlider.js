import { h } from "preact";
import * as d3 from "d3";
import { useState } from "preact/hooks";
import {
  DOMAIN,
  DOMAIN_DISCREET,
  THUMB_WIDTH,
  TRACK_WIDTH,
} from "../../../constants";
import { getColorScale } from "../../lib/viztools";
import ColorScaleLegend from "../colorScaleLegend/colorScaleLegend";
import style from "./style.css";

function clamp(n, min, max) {
  return n < min ? min : n > max ? max : n;
}

export default function DoubleSlider(props) {
  const min = props.min ?? 0,
    max = props.max ?? 1,
    step = props.step ?? 0.01;
  let [xLeft, setXLeft] = useState(min);
  let [xRight, setXRight] = useState(max);

  const domain = new Array(props.smoothness).fill().map((_, i) => i);
  const range = [THUMB_WIDTH / 2, TRACK_WIDTH + THUMB_WIDTH / 2];

  const xScale = d3.scaleBand().domain(DOMAIN_DISCREET).range(range);
  /* const colorScale = getColorScale(
    props.options.color,
    [domain[0], domain[domain.length - 1]],
    props.options.k
  ); */

  // Drag functionnality

  function setX(leftRight) {
    return function (x) {
      if (leftRight === "left") {
        x = clamp(x, min, xRight - step);
        if (x != xLeft) reportState(x, null);
        setXLeft(x);
      } else if (leftRight === "right") {
        x = clamp(x, xLeft + step, max);
        if (x != xRight) reportState(null, x);
        setXRight(x);
      }
    };
  }

  function reactDrag(setfn) {
    return function (event) {
      const offset =
        (event.target.parentElement?.getBoundingClientRect().left ?? 0) +
        THUMB_WIDTH / 2;
      let x = event.clientX - offset;
      const leftLimit = 0,
        rightLimit = TRACK_WIDTH;
      x = pxToX(clamp(x, leftLimit, rightLimit));
      x = roundToNearestStep(x);
      setfn(x);
    };
  }

  function reportState(n1, n2) {
    props.oninput([n1 ?? xLeft, n2 ?? xRight]);
  }

  function beginDrag(event, setFn) {
    event.preventDefault();
    const dragFn = reactDrag(setFn);
    //dragFn(event);
    document.onpointermove = dragFn;
    function endDrag() {
      document.onpointermove = null;
      document.onpointerleave = null;
      document.onpointercancel = null;
      document.onpointerup = null;
    }
    document.onpointerleave = document.onpointercancel = document.onpointerup = endDrag;
  }

  function xToPx(x) {
    return ((x - min) / (max - min)) * TRACK_WIDTH;
  }

  function pxToX(px) {
    return (px / TRACK_WIDTH) * (max - min) + min;
  }

  function roundToNearestStep(x) {
    return Math.ceil(x / step) * step;
  }

  function thumbStyle(x) {
    const left = xToPx(x);
    return `
    left: ${left}px;
    background-color: ${props.colorScale(x)};
    `;
  }

  return (
    <div class={style.doubleSlider}>
      <div id="track" class={style.track}>
        <ColorScaleLegend
          xScale={xScale}
          steps={DOMAIN_DISCREET}
          colorScale={props.colorScale}
          domain={[min, max]}
          options={props.options}
        />
      </div>
      <div
        id="thumbLeft"
        class={`${style.thumb} ${style.thumbLeft}`}
        style={thumbStyle(xLeft)}
        onpointerdown={e => beginDrag(e, setX("left"))}
      />
      <div
        id="thumbRight"
        class={`${style.thumb} ${style.thumbRight}`}
        style={thumbStyle(xRight)}
        onpointerdown={e => beginDrag(e, setX("right"))}
      />
    </div>
  );
}
