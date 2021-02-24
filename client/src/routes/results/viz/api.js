import * as d3 from "d3";
import { getColorScale, isValidDatum } from "./lib/viztools";
import { zAxis } from "./components/scatterplot/scatterplot-axes";
import { DOMAIN } from "../constants";
import { viz } from "./viz";

// !!! DIRECT DOM APPROACH, probably a pain to maintain in the future...
export function updateDotSize(size) {
  d3.selectAll(".dot").attr("stroke-width", size);
}

export function updateDotOpacity(opacity) {
  d3.selectAll(".dot").attr("stroke-opacity", opacity);
}

export function updateDotK(k, { data, columns, options }) {
  console.log(k, options.color)
  const colorScale = getColorScale(options.color, DOMAIN, k);
  console.log(colorScale)
  d3.selectAll(".dot")
    .data(data.filter(d => isValidDatum(d, columns)))
    .attr("stroke", d => colorScale(d[columns[2]]));
  d3.selectAll(".zaxis").remove();
  d3.select("svg").append("g").call(zAxis(colorScale));
}

export function newChartsCollection(data, questions, options) {
  let charts = [];
  // iterate pairwise
  for (let idx = 0; idx < questions.length; idx += 2) {
    const columns = [questions[idx], questions[idx + 1]];
    charts.push(viz(data, columns, options));
  }
  return charts;
}

export function newCustomChart(data, columns, options) {
  return viz(data, columns, options);
}

export function updateDotAppearance(update, { data, columns, options } = {}) {
  const { size, opacity, k } = update;
  if (update.size != null) updateDotSize(size);
  if (update.opacity != null) updateDotOpacity(opacity);
  if (update.k != null) updateDotK(k, { data, columns, options });
}

export function removeDotColorsSingleChart() {
  d3.selectAll(".dot").attr("stroke", "black");
}

export function newGraphs(data, columns, options) {
  const shouldShowCustomChart = columns => columns.length <= 3;
  if (shouldShowCustomChart(columns))
    return newCustomChart(data, columns, options);
  return newChartsCollection(data, columns, options);
}
