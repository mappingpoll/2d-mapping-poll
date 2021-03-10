import { h } from "preact";
import * as d3 from "d3";
import { useD3 } from "../../hooks/useD3";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../constants";
import { xScale, yScale } from "../../lib/scales";
import { appendAxes } from "./scatterplot-axes";
import {
  brushFn,
  computeDensity,
  isValidDatum,
  makeBrushTool,
} from "../../lib/viztools";
import { useMobileContext } from "../mobile-context";
import style from "./style.css";

export default function ContourScatterplot({
  data,
  columns,
  options,
  brushMap,
  callback,
}) {
  let [x, y] = columns;
  const isMobile = useMobileContext();
  const hasBrushing = Object.keys(brushMap).length > 0;

  function getClasses(d) {
    let classes = style.dot;
    if (hasBrushing) {
      classes += brushMap[d.id] ? ` ${style.brushed}` : ` ${style.notbrushed}`;
    }
    return classes;
  }

  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // append dots
      svg
        .append("g")
        .selectAll("path")
        .data(
          data
            .map((d, i) => (brushMap[i] ? { ...d, brushed: true } : d))
            .filter(d => isValidDatum(d, columns))
        )
        .join("path")
        .attr("stroke-width", options.size)
        .attr("stroke-opacity", options.opacity)
        .attr("class", getClasses)
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // compute the density data
      const densityData = computeDensity(
        data,
        options.contourBandwidth,
        columns
      );

      // Add the contour: several "path"
      svg
        .append("g")
        .selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("class", style.contourPath)
        .attr("d", d3.geoPath());

      // draw axes, columns
      appendAxes(svg);

      // add brushing
      if (!isMobile)
        svg.append("g").call(makeBrushTool(brushFn(data, columns, callback)));
    },
    [
      data,
      columns,
      brushMap,
      options.size,
      options.opacity,
      options.contourBandwidth,
    ]
  );

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
    </>
  );
}
