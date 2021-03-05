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
import { xScale, yScale } from "../../lib/scales";
import { arrowheads, xAxis, yAxis } from "../../lib/scatterplot-axes";
import { isValidDatum, makeBrushTool } from "../../lib/viztools";

import { questions } from "../../../../../i18n/fr.json";
import { Text } from "preact-i18n";
import style from "./style.css";
import { symFloor } from "../../lib/misc";
import { inRange } from "../../lib/data-manipulation";

export default function DensityScatterplot({
  data,
  columns,
  options,
  brushMap,
  callback,
}) {
  let [x, y] = columns;

  const brushTool = makeBrushTool(({ selection }) => {
    // get selection area
    if (selection == null) {
      callback({ type: "brush", payload: {} });
      return;
    }
    const extent = selection;
    const brushed = data.reduce(
      (map, d, i) =>
        isValidDatum(d, columns) &&
        isBrushed(extent, xScale(d[x]), yScale(d[y]))
          ? { ...map, [i]: true }
          : map,
      {}
    );
    callback({ type: "brush", payload: brushed });
  });

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
        .attr("stroke-opacity", options.opacity)
        .attr("class", d =>
          d.brushed ? `${style.dot} ${style.brushed}` : style.dot
        )
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // calc h and v densities
      function calcDensity(column, range) {
        const obj = {};
        data
          .filter(d => isValidDatum(d, column))
          .map(d => symFloor(d[column]))
          .filter(n => inRange(n, range))
          .forEach(n => {
            if (obj[n] == null) obj[n] = 1;
            else obj[n] += 1;
          });
        for (let i = range[0]; i <= range[1]; i++) {
          if (obj[i] == null) obj[i] = 0;
        }
        return Object.entries(obj)
          .sort(([a, _], [b, __]) => a - b)
          .map(([a, b]) => [+a, b]);
      }

      const hDensity = calcDensity(x, AXES_DOMAIN);
      const vDensity = calcDensity(y, AXES_DOMAIN);

      const max = d => Math.max(...d.map(([_, d]) => d));

      const hMax = max(hDensity);
      const vMax = max(vDensity);

      function dScale(max, scl, range) {
        return d3
          .scaleLinear()
          .domain([0, max])
          .range([scl(range[0]), scl(range[1])]);
      }

      const hScale = dScale(hMax, yScale, [AXES_DOMAIN[1], DOMAIN[1]]);
      const vScale = dScale(vMax, xScale, [AXES_DOMAIN[1], DOMAIN[1]]);

      const curveFn = d3.curveCardinal;

      const hLine = d3
        .line()
        .x(([n, _]) => xScale(n))
        .y(([_, d]) => hScale(d))
        .curve(curveFn);
      const vLine = d3
        .line()
        .x(([_, d]) => vScale(d))
        .y(([n, _]) => yScale(n))
        .curve(curveFn);

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
        .datum(vDensity)
        .attr("d", vLine);

      // draw axes, columns
      svg.append("g").call(arrowheads);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      // add brushing
      svg.call(brushTool);
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
