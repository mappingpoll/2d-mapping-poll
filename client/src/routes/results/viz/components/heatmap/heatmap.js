import { UNCERTAINTY } from "../../../constants";
import { xScale, yScale, xBand, yBand, arrowheadPaths } from "../../lib/scales";
import { xAxis, yAxis } from "../scatterplot/scatterplot-axes";
import { calcHeatmap, getColorScale } from "../../lib/viztools";

export function drawHeatmap(svg, data, columns, options) {
  // calc heatmap values (totals answers per grid zone (UNCERTAINTY*2 by UNCERTAINTY*2))
  const heatmap = calcHeatmap(data, columns);
  let min = Infinity,
    max = -Infinity;
  for (let { value } of heatmap) {
    let n = value;
    min = n < min ? n : min;
    max = n > max ? n : max;
  }
  const colorScale = getColorScale(options.color, [min, max], options.k);

  svg.selectAll(".graphcontent").remove();
  svg
    .append("g")
    // .attr("stroke-width", "0")
    .selectAll("rect")
    .data(heatmap)
    .join("rect")
    .attr("class", "rect graphcontent")
    .attr("y", d => yScale(d.y + UNCERTAINTY))
    .attr("x", d => xScale(d.x - UNCERTAINTY))
    .attr("width", xBand.bandwidth())
    .attr("height", yBand.bandwidth())
    // .attr("stroke", d => colorScale(d.value))
    .attr("fill", d => colorScale(d.value));

  // draw axes, columns
  // svg.append("g").call(arrowheadPaths);
  // svg.append("g").call(xAxis);
  // svg.append("g").call(yAxis);
}

