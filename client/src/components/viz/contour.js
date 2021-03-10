import { h } from "preact";
import * as d3 from "d3";
import { useD3 } from "../../hooks/useD3";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../constants";
import { appendAxes } from "./scatterplot-axes";
import style from "./style.css";
import { computeDensity } from "../../lib/viztools";

export default function ContourChart({ data, columns, options }) {
  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // compute the density data
      const densityData = computeDensity(
        data,
        options.contourBandwidth,
        columns
      );

      // Add the contour
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
    },
    [data, columns, options.contourBandwidth]
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
