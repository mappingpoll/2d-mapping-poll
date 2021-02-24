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

import Heatmap from "./components/heatmap/heatmap";
import Scatterplot from "./components/scatterplot/scatterplot"


export function viz(
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

  switch (graph) {
    case GRAPH_TYPE.heatmap:
      return <Heatmap data={data} columns={columns} options={{ size, opacity, color, k }} />;
    case GRAPH_TYPE.scatterplot:
      return <Scatterplot data={data} columns={columns} options={{ size, opacity, color, k }} />;
     
  }
}
