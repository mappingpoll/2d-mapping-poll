import { h } from "preact";
import * as d3 from "d3";
import { useD3 } from "../../hooks/useD3";
import { DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../constants";
import style from "./style.css";
import { computeDensity, getColorScale } from "../../lib/viztools";
import { appendAxes } from "./scatterplot-axes";

export default function ColorContour({ data, columns: columns2d, options }) {
  const ref = useD3(
    svg => {
      svg.selectAll("*").remove();

      // compute the density data
      const densityData = computeDensity(
        data,
        options.contourBandwidth,
        columns2d
      );

      // Prepare a color palette
      const color = getColorScale(
        options.color,
        [
          Math.min(...densityData.map(d => d.value)),
          Math.max(...densityData.map(d => d.value)),
        ],
        options.reverseColor
      );

      // Add the contour
      svg
        .append("g")
        .selectAll("path")
        .data(densityData)
        .enter()
        .append("path")
        .attr("class", style.coutourPath)
        .attr("d", d3.geoPath())
        .attr("stroke", (_, i) => (i === 0 ? color(1) : "none"))
        .attr("fill", d => color(d.value));

      // draw axes, columns
      appendAxes(svg);
    },
    [
      data,
      columns2d,
      options.color,
      options.contourBandwidth,
      options.reverseColor,
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
