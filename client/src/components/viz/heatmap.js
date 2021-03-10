import { h } from "preact";
import {
  UNCERTAINTY,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "../../constants";
import { xScale, yScale, xBand, yBand } from "../../lib/scales";
import { calcHeatmap, getColorScale } from "../../lib/viztools";
import style from "./style.css";
import { useD3 } from "../../hooks/useD3";
import { appendAxes } from "./scatterplot-axes";

export default function Heatmap({ data, columns, options }) {
  // calc heatmap values (totals answers per grid zone (UNCERTAINTY*2 by UNCERTAINTY*2))
  const ref = useD3(
    svg => {
      const heatmap = calcHeatmap(data, columns);
      let min = Infinity,
        max = -Infinity;
      for (let { value } of heatmap) {
        let n = value;
        min = n < min ? n : min;
        max = n > max ? n : max;
      }
      const average =
        heatmap
          .map(({ value }) => value)
          .reduce((sum, v) => {
            return v + sum;
          }, 0) / heatmap.length;
      max = average + (max - average) * 0.4;
      const colorScale = getColorScale(
        options.color,
        [min, max],
        options.reverseColor
      );
      svg.selectAll("*").remove();
      svg
        .append("g")
        .selectAll("rect")
        .data(heatmap)
        .join("rect")
        .attr("class", "rect graphcontent")
        .attr("stroke", "none")
        .attr("rx", "4")
        .attr("ry", `${(4 * yBand.bandwidth()) / xBand.bandwidth()}`)
        .attr("y", d => yScale(d.y + UNCERTAINTY))
        .attr("x", d => xScale(d.x - UNCERTAINTY))
        .attr("width", xBand.bandwidth())
        .attr("height", yBand.bandwidth())
        .attr("stroke", ({ value }) =>
          value < 1 ? colorScale(min + 3) : "none"
        )
        .attr("fill", d => colorScale(d.value));

      // draw axes, columns
      appendAxes(svg);
    },
    [data, columns, options.color, options.reverseColor]
  );

  return (
    <>
      <svg
        class={style.viz}
        ref={ref}
        viewBox={`0, 0, ${DEFAULT_CANVAS_WIDTH}, ${DEFAULT_CANVAS_HEIGHT}`}
        width={DEFAULT_CANVAS_WIDTH}
        height={DEFAULT_CANVAS_HEIGHT}
      />
    </>
  );
}
