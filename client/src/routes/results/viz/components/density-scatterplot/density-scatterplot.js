/* eslint-disable no-unused-vars */
import { h } from "preact";
import * as d3 from "d3";
import { useD3 } from "../../../../../hooks/useD3";
import {
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
  DOMAIN,
  DEFAULT_DOT_COLOR,
  AXES_DOMAIN,
} from "../../../constants";
import { xScale, yScale, arrowheadPaths } from "../../lib/scales";
import { xAxis, yAxis } from "../../lib/scatterplot-axes";
import { getColorScale, isValidDatum } from "../../lib/viztools";

import { questions } from "../../../../../i18n/fr.json";
import { Text } from "preact-i18n";
import style from "./style.css";
import { symFloor } from "../../lib/misc";

export default function DensityScatterplot({
  data,
  columns,
  options,
  brushMap,
  callback,
}) {
  let [x, y, z] = columns;
  const hasZDimension = columns.length === 3;
  let colorScale;
  if (hasZDimension) {
    colorScale = getColorScale(options.color, DOMAIN, options.k);
  }

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // draw axes, columns
      svg.append("g").call(arrowheadPaths);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

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
        .attr("stroke-opacity", options.opacity)
        // color, if any
        .attr(
          "stroke",
          hasZDimension ? d => colorScale(d[z]) : DEFAULT_DOT_COLOR
        )
        .attr(
          "class",
          d =>
            `${style.dot} ${
              /* hasZDimension && inRange(d[z], zRange)
                ? style.inRange
                :  */ d.brushed ===
              true
                ? style.brushed
                : ""
            }`
        )
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // calc h and v densities
      function calcDensity(column) {
        const obj = {};
        data
          .filter(d => isValidDatum(d, column))
          .forEach(d => {
            let n = symFloor(d[column]);
            if (obj[n] == null) obj[n] = 1;
            else obj[n] += 1;
          });
        return Object.entries(obj)
          .sort(([a, _], [b, __]) => a - b)
          .map(([a, b]) => [+a, b]);
      }

      function dScale(d, scl) {
        return d3
          .scaleLinear()
          .domain([0, Math.max(...d.map(([_, d]) => d))])
          .range([scl(AXES_DOMAIN[1]), scl(DOMAIN[1])]);
      }

      const hDensity = calcDensity(x);
      const vDensity = calcDensity(y);

      const hScale = dScale(hDensity, yScale);
      const vScale = dScale(vDensity, xScale);

      const hLine = d3
        .line()
        .x(([n, _]) => xScale(n))
        .y(([_, d]) => hScale(d))
        .curve(d3.curveBasis);
      const vLine = d3
        .line()
        .x(([_, d]) => vScale(d))
        .y(([n, _]) => yScale(n))
        .curve(d3.curveBasis);

      // draw horizontal density chart
      svg
        .append("path")
        .attr("class", style.densityline)
        .datum(hDensity)
        .attr("d", hLine);

      // draw vertical density chart
      svg
        .append("path")
        .attr("class", style.densityline)
        .datum(hDensity)
        .attr("d", vLine);

      // add brushing
      svg.call(
        d3
          .brush()
          .extent([
            [0, 0],
            [DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT],
          ])
          .on("start end", emitBrush)
      );
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
    },
    [data, columns, brushMap, options.size, options.opacity, options.k]
  );

  function isBrushed(extent, x, y) {
    const x0 = extent[0][0],
      y0 = extent[0][1],
      x1 = extent[1][0],
      y1 = extent[1][1];

    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
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
    </>
  );
}
