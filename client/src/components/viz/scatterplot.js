import { h } from "preact";
import { useD3 } from "../../hooks/useD3";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../constants";
import { xScale, yScale } from "../../lib/scales";
import { appendAxes } from "./scatterplot-axes";
import { brushFn, isValidDatum, makeBrushTool } from "../../lib/viztools";
import { useMobileContext } from "../mobile-context";
import style from "./style.css";

export default function Scatterplot({
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
        // filter out NAs
        .data(data.filter(d => isValidDatum(d, columns)))
        .join("path")
        .attr("stroke-width", options.size)
        .attr("stroke-opacity", options.opacity)
        .attr("class", getClasses)
        .attr("d", d => `M${xScale(d[x])}, ${yScale(d[y])}h0`);

      // draw axes, columns
      appendAxes(svg);

      // add brushing on desktop
      if (!isMobile)
        svg.append("g").call(makeBrushTool(brushFn(data, columns, callback)));
    },
    [data, columns, brushMap, options.size, options.opacity]
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
