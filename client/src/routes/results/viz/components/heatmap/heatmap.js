import * as d3 from "d3";
import { Text } from "preact-i18n";
import { UNCERTAINTY, DEFAULT_CANVAS_HEIGHT, DEFAULT_CANVAS_WIDTH } from "../../../constants";
import { xScale, yScale, xBand, yBand } from "../../lib/scales";
import { calcHeatmap, getColorScale } from "../../lib/viztools";
import { questions } from "../../../../../i18n/fr.json";
import style from "./style.css";
export default function drawHeatmap(data, columns, options) {

  const viz = d3.create("div");

  // make new svg element
  const svg = viz
    .append("svg")
    .attr("class", "viz")
    .attr("viewBox", [0, 0, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT])
    .attr("width", DEFAULT_CANVAS_WIDTH)
    .attr("height", DEFAULT_CANVAS_HEIGHT);

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



    return (
      <div class={style["viz-container"]} innerHTML={viz.html()}>
      <div class={`${style.label} ${style.left}`}>
        <Text id={`questions.${columns[0]}.fr.start`}>
          {questions[columns[0]].en.start}
        </Text>
      </div>
      <div class={`${style.label} ${style.right}`}>
        <Text id={`questions.${columns[0]}.fr.end`}>
          {questions[columns[0]].en.end}
        </Text>
      </div>
      <div class={`${style.label} ${style.bottom}`}>
        <Text id={`questions.${columns[1]}.fr.start`}>
          {questions[columns[1]].en.start}
        </Text>
      </div>
      <div class={`${style.label} ${style.top}`}>
        <Text id={`questions.${columns[1]}.fr.end`}>
          {questions[columns[1]].en.end}
        </Text>
      </div>
    </div>
    );
}

