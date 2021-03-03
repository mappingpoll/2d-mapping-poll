import { h } from "preact";
import * as d3 from "d3";
import { useD3 } from "../../../../../hooks/useD3";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DOMAIN,
  DEFAULT_DOT_COLOR,
} from "../../../constants";
import { xScale, yScale, arrowheadPaths } from "../../lib/scales";
import { xAxis, yAxis } from "../../lib/scatterplot-axes";
import { isValidDatum } from "../../lib/viztools";

import { questions } from "../../../../../i18n/fr.json";
import { Text } from "preact-i18n";
import style from "./style.css";
import DoubleSlider from "../double-range-slider/DoubleSlider";
import { inRange } from "../../lib/data-manipulation";

export default function Scatterplot({
  data,
  columns,
  colorScale,
  options,
  brushMap,
  zRange,
  zGlobal,
  callback,
}) {
  let [x, y, z] = columns;
  z = zGlobal ?? z;
  const isCustomChart = columns.length === 3;
  const shouldUseZ = isCustomChart || zGlobal != null;
  const brushTool = d3
    .brush()
    .extent([
      [0, 0],
      [DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT],
    ])
    .on("start end", emitBrush);

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();
      // append dots
      svg
        .append("g")
        .selectAll("path")
        // filter out NAs
        .data(
          data
            .map((d, i) => (brushMap[i] ? { ...d, brushed: true } : d))
            .filter(d => isValidDatum(d, columns))
        )
        .join("path")
        .attr("stroke-width", options.size)
        .attr("stroke-opacity", d =>
          shouldUseZ && inRange(d[z], zRange) ? 0.8 : options.opacity
        )
        // color, if any
        .attr("stroke", d =>
          shouldUseZ && inRange(d[z], zRange)
            ? colorScale(d[z])
            : DEFAULT_DOT_COLOR
        )
        // styling
        .attr(
          "class",
          d => `${style.dot} ${d.brushed === true ? style.brushed : ""}`
        )
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // draw axes, columns
      svg.append("g").call(arrowheadPaths);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      // add brushing
      svg.call(brushTool);
    },
    [
      data,
      columns,
      colorScale,
      brushMap,
      zRange,
      zGlobal,
      options.size,
      options.opacity,
    ]
  );

  function isBrushed(extent, x, y) {
    const x0 = extent[0][0],
      y0 = extent[0][1],
      x1 = extent[1][0],
      y1 = extent[1][1];

    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function emitBrush(brushEvent) {
    // get selection area
    const extent = brushEvent.selection;
    const brushed = data.reduce(
      (map, d, i) =>
        isValidDatum(d, columns) &&
        isBrushed(extent, xScale(d[x]), yScale(d[y]))
          ? { ...map, [i]: true }
          : map,
      {}
    );
    callback({ type: "brush", payload: brushed });
  }

  function handleZRangeInput(range) {
    callback({
      type: "zrange",
      payload: { zRange: range },
    });
  }

  return (
    <>
      <svg
        id="dataviz_scatterplot"
        class={style.viz}
        ref={ref}
        viewBox={`0, 0, ${DEFAULT_CANVAS_WIDTH}, ${DEFAULT_CANVAS_HEIGHT}`}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
      />
      <div class={`${style.label} ${style.right}`}>
        <Text id={`questions.${x}.fr.end`}>{questions[x].en.end}</Text>
      </div>
      <div class={`${style.label} ${style.left}`}>
        <Text id={`questions.${x}.fr.start`}>{questions[x].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.bottom}`}>
        <Text id={`questions.${y}.fr.start`}>{questions[y].en.start}</Text>
      </div>
      <div class={`${style.label} ${style.top}`}>
        <Text id={`questions.${y}.fr.end`}>{questions[y].en.end}</Text>
      </div>
      {isCustomChart && (
        <>
          <div class={`${style.label} ${style.zleft}`}>
            <Text id={`questions.${z}.fr.start`}>{questions[z].en.start}</Text>
          </div>
          <div class={style.zslider}>
            <DoubleSlider
              init={zRange}
              min={DOMAIN[0]}
              max={DOMAIN[1]}
              step={0.5}
              smoothness={100}
              options={options}
              oninput={handleZRangeInput}
              colorScale={colorScale}
            />
          </div>
          <div class={`${style.label} ${style.zright}`}>
            <Text id={`questions.${z}.fr.end`}>{questions[z].en.end}</Text>
          </div>
        </>
      )}
    </>
  );
}
