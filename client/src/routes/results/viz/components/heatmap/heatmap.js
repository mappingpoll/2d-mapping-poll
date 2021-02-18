import { h } from "preact";
import { calcHeatmap } from "../../lib/viztools";
import { getColorScale } from "../../lib/viztools";


export function VizHeatmap(svg, data, columns, options) {
  // calc heatmap values (totals answers per grid zone (UNCERTAINTY*2 by UNCERTAINTY*2))
  const heatmap = calcHeatmap(data, columns);
  let min = Infinity,
    max = -Infinity;
  for (let row of heatmap) {
    for (let value of row) {
      let n = value;

    min = n < min ? n : min;
    max = n > max ? n : max;
    }
  }
  const colorScale = getColorScale(options.color, [min, max], options.k);

  svg.selectAll(".graphcontent").remove();
  // svg
  //   .append("g")
  //   .attr("stroke-width", "1.5")
  //   .selectAll("rect")
  //   .data(heatmap)
  //   .join("rect")
  //   .attr("class", "rect graphcontent")
  //   .attr("x", d => xScale(d.x - UNCERTAINTY))
  //   .attr("y", d => yScale(d.y + UNCERTAINTY))
  //   .attr("width", xBand.bandwidth())
  //   .attr("height", yBand.bandwidth())
  //   .attr("stroke", d => colorScale(d.value))
  //   .attr("fill", d => colorScale(d.value));

  // // draw axes, columns
  // svg.append("g").call(markers);
  // svg.append("g").call(xAxis);
  // svg.append("g").call(yAxis);
}


export default function Heatmap(props) {
  const { svg, heatmap, columns, options } = props;
  return (<div />)
}