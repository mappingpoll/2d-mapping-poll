import { h } from "preact";
import * as d3 from "d3";
import style from "./style.css"
import {
  GRAPH_TYPE,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_COLOR_SCHEME,
  DEFAULT_DOT_SIZE,
  DEFAULT_DOT_OPACITY,
  DEFAULT_COLOR_MID,
  DEFAULT_GRAPH_TYPE,
} from "../constants";

import drawHeatmap from "./components/heatmap/heatmap";
import drawScatterplot from "./components/scatterplot/scatterplot"


export function Viz(
  data,
  columns,
  {
    size = DEFAULT_DOT_SIZE,
    opacity = DEFAULT_DOT_OPACITY,
    graph = DEFAULT_GRAPH_TYPE,
    color = DEFAULT_COLOR_SCHEME,
    k = DEFAULT_COLOR_MID,
  } = {}
) {

  const viz = d3.create("div");

  // make new svg element
  const svg = viz
    .append("svg")
    .attr("class", style.viz)
    .attr("viewBox", [0, 0, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT])
    .attr("width", DEFAULT_CANVAS_WIDTH)
    .attr("height", DEFAULT_CANVAS_HEIGHT);

  let s;

  switch (graph) {
    case GRAPH_TYPE.heatmap:
      s = drawHeatmap(svg,data, columns, { size, opacity, color, k });
      break;
    case GRAPH_TYPE.scatterplot:
      s = drawScatterplot(svg, data, columns, { size, opacity, color, k });
      break;
  }
  return (
    <div class={style["viz-container"]} innerHTML={viz.html()}>
      {s}
    </div>
  )
}
